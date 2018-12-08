package engine;



import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;


public class DBConnector {
	
	Connection connection = null;
	Connection relation_connection = null;
	
	public DBConnector(){
				
		try {
			Class.forName("com.mysql.jdbc.Driver");
			this.connection = DriverManager.getConnection("jdbc:mysql://mariatest.cryajph31jpg.eu-west-3.rds.amazonaws.com:3306/Chinook?user=admin&password=password");
			this.relation_connection = DriverManager.getConnection("jdbc:mysql://mariatest.cryajph31jpg.eu-west-3.rds.amazonaws.com:3306/Chinook?user=admin&password=password");
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
		
		/*
		 * Query Database with given table and sql query string
		 * Convert The result into a JSONApi response
		 * 
		 */
		
		JSONArray response_array = new JSONArray();
		String[] ids = {"GenreId", "AlbumId", "ArtistId", "TrackId"};
		Statement stmt = null;
		System.out.println(query);
		
		
		String bufferedAlbumId = "";
		
		
		
		
		//colum name and info in column
		// {artist: iron maiden} 
		JSONObject rel = new JSONObject();
		//all columns with info
		/*
		 * // {artist: iron maiden, name:"dingdong", something:"else"}
		 */
		JSONArray rel_data = new JSONArray();

		//data:relationDataArray
		JSONObject relation = new JSONObject();
		//top level relationship json
		JSONObject row_relationships = new JSONObject();
		
		

		
		
		try {
			
			stmt = connection.createStatement();
			ResultSet rs = stmt.executeQuery(query);

			while(rs.next()) {

				//build row info json, this is the array 
				JSONObject row_info = new JSONObject();
				
				String col_name = "";
				String table_name = "";
				
				
				JSONObject queryObject = new JSONObject();
				
				ResultSetMetaData md = rs.getMetaData();
				int colCount = md.getColumnCount();  

				for (int j = 1; j <= colCount ; j++){  
					col_name = md.getColumnName(j);
					table_name = md.getTableName(j);
					if(table.equals("Album") && col_name.equals("TrackId")) {
						continue;
					}
					row_info.put(col_name.toLowerCase(), rs.getObject(col_name));

				}


				String sql;
				Statement relation_statement = null;

				switch(table) {
					case "Track":	
						rel = new JSONObject();
						rel_data = new JSONArray();
						row_relationships = new JSONObject();
						rel = new JSONObject();
						relation = new JSONObject();
						
						String albumId = ""+rs.getObject("AlbumId");
						
						rel.put("id", albumId);
						rel.put("type", "album");
						
						rel_data.put(rel);
						
						//relation.put("data", rel_data);
						row_relationships.put("album", rel_data);
						
						//reset jsons
						rel = new JSONObject();
						rel_data = new JSONArray();
						relation = new JSONObject();
						
						String artistId = ""+rs.getObject("ArtistId");
						String artistName = ""+rs.getObject("Artist.Name");
						
						rel.put("id", artistId);
						rel.put("name", artistName);
						rel.put("type", "artist");
						
						rel_data.put(rel);
						//relation.put("data", rel_data);
						row_relationships.put("artist", rel_data);
						break;
						
						/*
						if(!table_name.equals("Track")) {
							rel.put(table_name.toLowerCase()+"Id", rs.getObject(table_name+"Id"));
							rel.put("type", table_name.toLowerCase());
							rel_data.put(rel);
							
							relation.put("data", rel_data);
							row_relationships.put(table_name.toLowerCase()+"s", relation);
						}*/


					case "Album":
							//sql = "SELECT Track.TrackId FROM Track LEFT JOIN Album ON Album.AlbumId = Track.AlbumId WHERE Track.AlbumId = " + rs.getObject("AlbumId");
							String rsAlbum = ""+rs.getObject("AlbumId");
							
							
							if(bufferedAlbumId.equals(rsAlbum)) {				
								System.out.println("Album is still the same, just add track info");
								//bufferedAlbumId = rsAlbum;
								
								rel = new JSONObject();
								rel.put("id", rs.getObject("TrackId"));
								rel.put("type", "track");
								rel_data.put(rel);
								relation.put("data", rel_data);
								continue;
								
							}else {
								bufferedAlbumId = rsAlbum;
								relation.put("data", rel_data);
								row_relationships.put("tracks", relation);
								
								if(bufferedAlbumId=="") {
									continue;
								}
								
								
								//Add artist relation
								rel = new JSONObject();
								row_relationships = new JSONObject();
								rel_data = new JSONArray();
								relation = new JSONObject();

								rel.put("id", rs.getObject("ArtistId"));
								rel.put("type", "artist");

								rel_data.put(rel);
								//relation.put("data", rel_data);
								row_relationships.put("artist", rel_data);

								rel_data = new JSONArray();
								 
								//add first track to relation
								rel = new JSONObject();
								relation = new JSONObject();
								
								rel.put("id", rs.getObject("TrackId"));
								rel.put("type", "track");
								rel_data.put(rel);
								relation.put("data", rel_data);
							}

							
							break;
				}

				//add id to the query object
				queryObject.put("id", rs.getObject(table.toLowerCase()+"Id"));
				//add the type to the query object, and add ID and type
				queryObject.put("type", table.toLowerCase());
				//add attributes and relationships to the queryObject json. Put the row info in it
				/* attributes: {
				 * 		composer: info
				 * 		...
				 * },
				 * relationships: {
				 * 		ArtistID: 1
				 * 		...
				 * }
				 */

				//build
				queryObject.put("attributes", row_info);
				queryObject.put("relationships", row_relationships);

				//add the query json object to the response json array
				response_array.put(queryObject);

			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
		JSONObject responseObject = new JSONObject();
		responseObject.put("data", response_array);
		//System.out.println(responseObject);
		try {
			connection.close();
			relation_connection.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return responseObject;
	}
	

	public String queryBuilder (String table, Map<String, String[]> params) {

		String query = "SELECT ";
		String columns = "", conditions = "", order = "", limit = "", leftJoin = "";
		List<String> sideload = new ArrayList<String>();

		
		Iterator<String> paramsIterator = params.keySet().iterator();
		while(paramsIterator.hasNext()) {
			
			String qparam = paramsIterator.next();
			String[] value = params.get(qparam);
			
			String combined = qparam+"='"+value[0]+"'";
			System.out.println(combined);
			
		}
		
		
		//IF NO COLUMNS
		if(columns==null || columns=="") {
			columns = "*"; //select all if no columns given
		}

		
		query += columns;
		query += " FROM "+table;
		query += leftJoin;
		//query += conditions;
		//query += order;
		query += limit;

		System.out.println(query);
		return query;
		
	}


	public JSONObject testConnection(String table) {
		Statement stmt = null;
		String query = "SELECT * FROM "+table+" LIMIT 25;";
		JSONObject jo = queryDB(query, table);
		return jo;
	}
	
}
