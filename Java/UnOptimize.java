/******************************************************
 INTENTIONALLY BAD PERFORMANCE JAVA CODE
******************************************************/

import java.io.*;
import java.util.*;

public class PerformanceTest {

    private static List<String> logList = new ArrayList<>(); // ❌ grows unbounded

    public static void main(String[] args) throws Exception {

        for(int i=0;i<100000;i++){
            processData(i);
        }
    }

    private static void processData(int num) {
        
        // ❌ bad: repeatedly building string objects
        String result = "";
        for(int i=0; i<5000;i++){
            result += num + "-" + i; 
        }

        logList.add(result); // ❌ memory keeps growing

        try {
            // ❌ simulate blocking IO + CPU wait
            Thread.sleep(50);

            // ❌ expensive disk read every iteration
            BufferedReader br = new BufferedReader(
                    new FileReader("data.txt"));
            String line;
            while((line = br.readLine()) != null){
                compute(line, result);
            }
            br.close();

        } catch(Exception e){
            // swallow errors
        }
    }

    private static int compute(String line, String result){
        int sum = 0;

        // ❌ nested loops → quadratic time
        for(int i=0;i<line.length();i++){
            for(int j=0;j<result.length();j++){
                sum += i + j;
            }
        }
        return sum;
    }
}
