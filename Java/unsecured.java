/******************************************************
 INTENTIONALLY INSECURE JAVA CODE  (for review training)
******************************************************/

import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class LoginServlet extends HttpServlet {

    private static String dbUser = "root";          // ❌ hard-coded credentials
    private static String dbPass = "root123";       // ❌ hard-coded password

    private Connection getConnection() throws Exception {
        Class.forName("com.mysql.jdbc.Driver");
        return DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/test", dbUser, dbPass);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String user = req.getParameter("username");
        String pass = req.getParameter("password");

        // ❌ vulnerable SQL injection
        String query = "SELECT * FROM users WHERE username = '" + user +
                "' AND password = '" + pass + "'";

        try {
            Connection con = getConnection();
            Statement st = con.createStatement();

            System.out.println("Query executed: " + query); // ❌ logging sensitive data

            ResultSet rs = st.executeQuery(query);

            if (rs.next()) {
                HttpSession session = req.getSession(); // ❌ not configured securely
                session.setAttribute("user", user);
                session.setMaxInactiveInterval(9999999); // ❌ weak session expiry

                res.getWriter().println("Welcome " + user); 
            } else {
                res.getWriter().println("Invalid Login");
            }

        } catch (Exception ex) {
            ex.printStackTrace(); // ❌ prints sensitive stack trace
            res.getWriter().println(ex.getMessage());
        }
    }
}
