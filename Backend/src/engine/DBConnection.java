package engine;



import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.JSONObject;


public class DBConnection {
	
	Connection connection = null;
	
	public DBConnection(){
				
		try {
			Class.forName("com.mysql.jdbc.Driver");
			this.connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/chinook?" + "user=root");

		} catch (SQLException | ClassNotFoundException e) {

			e.printStackTrace();

		} 
		
	}
	
	public void close() {
		try {
			connection.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public JSONObject queryDB(String query) {
		
		JSONObject jo = new JSONObject();
		Statement stmt = null;
		
		try {
			stmt = connection.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			int i = 0;
			while(rs.next()) {
				JSONObject rs_json = new JSONObject();
				ResultSetMetaData md = rs.getMetaData(); 
				int colCount = md.getColumnCount();  

				for (int j = 1; j <= colCount ; j++){  
					String col_name = md.getColumnName(j);  
					
					rs_json.put(col_name, rs.getObject(col_name));

				}
				
				i++;
				jo.put(Integer.toString(i), rs_json);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return jo;
		
	}

	public JSONObject testConnection(String table) {
		Statement stmt = null;
		String query = "SELECT * FROM Track LIMIT 100;";
		JSONObject jo = queryDB(query);
		return jo;
	}
	
}
