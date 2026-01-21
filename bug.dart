// PURPOSE: Code Review Test File
// Contains BUGS, SECURITY ISSUES, and PERFORMANCE ISSUES

import 'dart:io';

class UserService {
  String apiKey = "HARDCODED_SECRET_KEY"; // SECURITY ISSUE

  List<String> users = [];

  void addUser(String? name) {
    // BUG: null not handled properly
    users.add(name!);
  }

  String getUser(int index) {
    // BUG: no bounds check
    return users[index];
  }

  void logUserPassword(String password) {
    // SECURITY ISSUE: sensitive data logging
    print("User password is: $password");
  }

  void saveUserToFile(String userInput) {
    // SECURITY ISSUE: command injection risk
    Process.run('echo', [userInput]);
  }

  void loadUsers() {
    // PERFORMANCE ISSUE: blocking IO on main thread
    sleep(Duration(seconds: 2));
    print("Users loaded");
  }

  String buildUserReport() {
    // PERFORMANCE ISSUE: string concatenation in loop
    String report = "";
    for (int i = 0; i < users.length; i++) {
      report = report + users[i] + "\n";
    }
    return report;
  }

  void processUsers() {
    // PERFORMANCE ISSUE: unnecessary object creation
    for (int i = 0; i < 100000; i++) {
      DateTime.now();
    }
  }
}

void main() {
  UserService service = UserService();

  service.addUser("Kiran");
  service.addUser(null); // Runtime crash

  print(service.getUser(5)); // Index error

  service.logUserPassword("mypassword123");

  service.saveUserToFile("test && rm -rf /");

  service.loadUsers();

  print(service.buildUserReport());

  service.processUsers();
}
