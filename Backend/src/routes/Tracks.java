package routes;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import engine.DBConnector;
import engine.PATCHServlet;

@WebServlet("/tracks/*")
public class Tracks extends PATCHServlet {
	private static final long serialVersionUID = 1L;
       
    public Tracks() {
        super();

    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        
		String path = "";
		try{
			path = request.getPathInfo().substring(1).toLowerCase();
		} catch (NullPointerException e) {
			
		}
		
		JSONObject res = new JSONObject();
		PrintWriter out = response.getWriter();
		
		DBConnector db = new DBConnector();
		String sql = "";
		Boolean singleRecord = false;
		if(path.equals("")) {
			sql = "SELECT * FROM Track LEFT JOIN Album on Track.AlbumId = Album.albumId LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId LEFT JOIN Genre on Track.GenreId = Genre.GenreId ";
		} else {
			singleRecord = true;
			sql = "SELECT * FROM Track LEFT JOIN Album on Track.AlbumId = Album.albumId LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId LEFT JOIN Genre on Track.GenreId = Genre.GenreId WHERE TrackId = "+path;
		}
		

		res = db.queryDB(sql, "Track", singleRecord);
		response.setContentType("application/json");
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    response.addHeader("Access-Control-Allow-Methods", "GET");
	    response.addHeader("Access-Control-Allow-Headers", "Content-Type");
	    response.addHeader("Access-Control-Max-Age", "86400");
		out.print(res);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("application/json");
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    response.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
	    response.addHeader("Access-Control-Allow-Headers", "Content-Type");
	    response.addHeader("Access-Control-Max-Age", "86400");
		System.out.println("Doing a post!!! OMG");
	}
	
	protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Max-Age", "86400");

		System.out.println("Doing OPTIONS!!! OMG");
	}
	
	public void doPatch(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Doing PATCH!! OMG");
		PrintWriter out = response.getWriter();
		
		String body = request.getReader().lines()
			    .reduce("", (accumulator, actual) -> accumulator + actual);
		JSONObject responseBody = new JSONObject(body);

		JSONObject responseData = responseBody.getJSONObject("data");
		JSONObject attributes  = responseData.getJSONObject("attributes");

		System.out.println(attributes);
		
		//System.out.println(data);
				
		//get record id. ember gives this as route tracks/123
		String recordid = "";
		try{
			recordid = request.getPathInfo().substring(1).toLowerCase();
		} catch (NullPointerException e) {
			
		}
		

		JSONObject res = new JSONObject();

		DBConnector db = new DBConnector();
		if(recordid.equals("")) {
			res.put("message","Track record patching failed... route is wrong?");
		} else {

			
			
			try {
				db.updateRecord("Track", attributes, recordid);
			
				String updateSQL = "SELECT * FROM Track LEFT JOIN Album on Track.AlbumId = Album.albumId LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId LEFT JOIN Genre on Track.GenreId = Genre.GenreId WHERE TrackId = "+recordid;
				
				db = new DBConnector();
				res = db.queryDB(updateSQL, "Track", true);
			} catch (SQLException e) {
				res.put("error", e);
				e.printStackTrace();
			}
			
		}

		
		response.setContentType("application/json");
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "GET, POST, PATCH");
		response.addHeader("Access-Control-Allow-Headers", "Content-Type");
		response.addHeader("Access-Control-Max-Age", "86400");

		out.print(res);

	}

}
