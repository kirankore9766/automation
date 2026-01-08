/******************************************************
 INTENTIONALLY BUGGY JAVA CODE FOR REVIEW
******************************************************/
import java.util.*;
import java.io.*;

public class BugExample {

    private static List<String> data;  // ❌ not initialized

    private static int count = 0;

    public static void main(String[] args) {

        loadData(); // ❌ may not load before use

        for(int i=0; i<=data.size(); i++){ // ❌ off-by-one bug
            processItem(data.get(i));
        }

        if(count = 10){           // ❌ assignment instead of comparison
            System.out.println("Limit reached");
        }

        // ❌ race condition
        Thread t1 = new Thread(BugExample::increment);
        Thread t2 = new Thread(BugExample::increment);
        t1.start();
        t2.start();

        System.out.println("Count = " + count);
    }

    private static void loadData() {
        try {
            BufferedReader br =
             new BufferedReader(new FileReader("input.txt"));
            String line;
            while((line = br.readLine()) != null){
                data.add(line);    // ❌ data is null
            }
        } catch(Exception e){
            // swallow exceptions
        }
    }

    private static void processItem(String s){
        if(s == "error"){ // ❌ wrong String comparison
            System.out.println("Error detected");
            return;
        }
        System.out.println("Processing " + s);
    }

    private static void increment(){
        for(int i=0;i<1000;i++){
            count++;   // ❌ not atomic; race condition
        }
    }
}
