package crud_operation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Scanner;

import com.mysql.cj.jdbc.result.ResultSetMetaData;

public class CRUD_operation {

	public static void main(String[] args) {
		CRUD_operation objTest=new CRUD_operation();
		Scanner sc= new Scanner(System.in);
		System.out.println("Enter the number of students to insert: ");
		int n=sc.nextInt();
		for(int i=0;i<n;i++)
		{
			System.out.print("Enter student sl no: ");
			int  sl_no=sc.nextInt();
			sc.nextLine();
			System.out.print("Enter the student's name: ");
			String name=sc.nextLine();
			objTest.create_data(sl_no, name);
		}
		objTest.read_data();
		objTest.read_data_with_condition();
		objTest.update_data(104, 113, "Nandini");
		objTest.read_data();
		objTest.alter_table();
		objTest.describe_table(); 
		System.out.println("Enter the record's student_id to delete: ");
		int s_id=sc.nextInt();
		sc.nextLine();
		objTest.delete_data(s_id);
	    sc.close();
}

public void create_data(int sl_no,String name){
	DB_connection obj_DB_Connection=new DB_connection();
	Connection connection=obj_DB_Connection.get_connection();
	PreparedStatement ps=null;
	try {
		String query="insert into student values (?,?)";
		ps=connection.prepareStatement(query);
		ps.setInt(1, sl_no);
		ps.setString(2, name);
		System.out.println(ps);
		ps.executeUpdate();
	} catch (Exception e) {
		System.out.println(e);
	}
}
public void read_data() {
    DB_connection obj_DB_Connection = new DB_connection();
    Connection connection = obj_DB_Connection.get_connection();
    PreparedStatement ps = null;
    ResultSet rs = null;

    try {
        String query = "SELECT * FROM student";
        ps = connection.prepareStatement(query);
        rs = ps.executeQuery();

        ResultSetMetaData metaData = (ResultSetMetaData) rs.getMetaData();
        int columnCount = metaData.getColumnCount();

        System.out.println("Student Table Data:");
        while (rs.next()) {
            for (int i = 1; i <= columnCount; i++) {
                Object value = rs.getObject(i);
                System.out.print(value + "\t");
            }
            System.out.println();
        }
    } catch (Exception e) {
        System.out.println("Error: " + e);
    }
}
public void read_data_with_condition() {
    DB_connection obj_DB_Connection = new DB_connection();
    Connection connection = obj_DB_Connection.get_connection();
    PreparedStatement ps = null;
    ResultSet rs = null;
    Scanner sc = new Scanner(System.in);

    try {
        System.out.print("Enter SL_NO to search: ");
        int sl_no = sc.nextInt();

        String query = "SELECT * FROM student WHERE s_id = ?";
        ps = connection.prepareStatement(query);
        ps.setInt(1, sl_no);

        rs = ps.executeQuery();

        ResultSetMetaData metaData = (ResultSetMetaData) rs.getMetaData();
        int columnCount = metaData.getColumnCount();

        System.out.println("\nSearch Result:");
        boolean found = false;
        while (rs.next()) {
            found = true;
            for (int i = 1; i <= columnCount; i++) {
                Object value = rs.getObject(i);
                System.out.print(value + "\t");
            }
            System.out.println();
        }

        if (!found) {
            System.out.println("No record found with SL_NO: " + sl_no);
        }
        

    } catch (Exception e) {
        System.out.println("Error: " + e);
    }
}
public void update_data(int sl_no,int new_sl_no,String name){
	DB_connection obj_DB_Connection=new DB_connection();
	Connection connection=obj_DB_Connection.get_connection();
	PreparedStatement ps=null;
try {
	String query="update student set s_id =? , s_name =? where s_id =? ";
	ps=connection.prepareStatement(query);
	ps.setInt(1, new_sl_no);
	ps.setString(2, name);
	ps.setInt(3, sl_no);
	System.out.println(ps);
	ps.executeUpdate();
	}	 
catch (Exception e) {
System.out.println(e);
		}
	}
public void alter_table() {
    DB_connection obj_DB_Connection = new DB_connection();
    Connection connection = obj_DB_Connection.get_connection();
    PreparedStatement ps = null;

    try {
        String query = "ALTER TABLE student ADD age INT";
        ps = connection.prepareStatement(query);
        ps.executeUpdate();
        System.out.println("Column 'age' added successfully to student table.");
    } catch (Exception e) {
        System.out.println("Error (maybe column already exists): " + e);
    }
}
public void describe_table() {
    DB_connection obj_DB_Connection = new DB_connection();
    Connection connection = obj_DB_Connection.get_connection();
    PreparedStatement ps = null;
    ResultSet rs = null;

    try {
        String query = "DESCRIBE student";
        ps = connection.prepareStatement(query);
        rs = ps.executeQuery();

        System.out.println("\nTable Structure (DESCRIBE student):");
        System.out.println("Field\tType\tNull\tKey\tDefault\tExtra");
        while (rs.next()) {
            for (int i = 1; i <= 6; i++) {
                Object value = rs.getObject(i);
                System.out.print(value + "\t");
            }
            System.out.println();
        }
    } catch (Exception e) {
        System.out.println("Error describing table: " + e);
    }
}
public void delete_data(int s_id){
	DB_connection obj_DB_Connection=new DB_connection();
	Connection connection=obj_DB_Connection.get_connection();
	PreparedStatement ps=null;
	try {
		String query="delete from student where s_id=?";
		ps=connection.prepareStatement(query);
		ps.setInt(1, s_id);
		System.out.println(ps);
		ps.executeUpdate();
	} catch (Exception e) {
		System.out.println(e);
	}

}

}