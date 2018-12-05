package engine;



import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Iterator;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;


public class DBConnector {
	
	Connection connection = null;
	
	public DBConnector(){
				
		try {
			Class.forName("com.mysql.jdbc.Driver");
			this.connection = DriverManager.getConnection("jdbc:mysql://mariatest.cryajph31jpg.eu-west-3.rds.amazonaws.com:3306/Chinook?user=admin&password=password");

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
	
	public JSONObject queryDB(String query, String table) {
		JSONArray response_array = new JSONArray();
				
		Statement stmt = null;
		
		try {
			stmt = connection.createStatement();
			ResultSet rs = stmt.executeQuery(query);
			
			while(rs.next()) {
				JSONObject queryObject = new JSONObject();
				
				ResultSetMetaData md = rs.getMetaData();
				int colCount = md.getColumnCount();  
				//build row info json
				JSONObject row_info = new JSONObject();
				for (int j = 1; j <= colCount ; j++){  
					String col_name = md.getColumnName(j);  
					String table_name = md.getTableName(j);
					String combined = table_name+"_"+col_name;
					row_info.put(combined, rs.getObject(col_name));
				}
				//add id to the query object
				queryObject.put("id", rs.getObject(table+"Id"));
				//add the type to the query object, and add ID and type
				queryObject.put("type", table);
				//add attributes to the queryObject json. Put the row info in it
				/* attributes: {
				 * 		composer: info
				 * 		...
				 * }
				 */
				JSONObject attributes = new JSONObject();
				queryObject.put("attributes", row_info);

				//add the query json object to the response json array
				response_array.put(queryObject);
				
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
		JSONObject responseObject = new JSONObject();
		responseObject.put("data", response_array);
		//System.out.println(responseObject);
		
		return responseObject;
	}

	public String queryBuilder (String table, Map<String, String[]> params) {

		String query = "SELECT ";
		String columns = "", conditions = "", order = "", limit = "", leftJoin = "";
		String[] sideload = {};

		
		Iterator<String> paramsIterator = params.keySet().iterator();
		while(paramsIterator.hasNext()) {
			
			String qparam = paramsIterator.next();
			String[] value = params.get(qparam);
			
			String combined = qparam+"='"+value[0]+"'";
			System.out.println(combined);
			if(qparam=="limit") {
				limit = value[0];
			}
			if(qparam=="columns") {
				//COLUMND
			}


		}
		
		//IF SIDELOAD IS EMPTY, SIDELOAD ALL
		if(sideload.length == 0) {
			
			switch(table) {
				case "Track":
					leftJoin += "Album ON Album.AlbumId = Track.AlbumId LEFT JOIN Artist ON Album.ArtistId = Artist.ArtistId LEFT JOIN Genre ON Track.GenreId = Genre.GenreId";
					break;
				case "Album":
					leftJoin += "Track ON Album.AlbumId = Track.AlbumId LEFT JOIN Artist ON Artist.ArtistId = Album.ArtistId LEFT JOIN Genre ON Track.GenreId = Genre.GenreId";
				default: 
					break;
			};
			
		}
		
		//IF NO COLUMNS
		if(columns==null || columns=="") {
			columns = "*"; //select all if no columns given
		}

		if(limit==null || limit=="" || limit == "0") {
			limit="999999999";
		}
		
		query += columns;
		query += " FROM "+table;
		query += " LEFT JOIN "+leftJoin;
		//query += conditions;
		//query += order;
		query += " LIMIT "+limit;

		return query;
		
	}


	public JSONObject testConnection(String table) {
		Statement stmt = null;
		String query = "SELECT * FROM "+table+" LIMIT 25;";
		JSONObject jo = queryDB(query, table);
		return jo;
	}
	
}
