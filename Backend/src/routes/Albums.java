package routes;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import engine.DBConnector;

@WebServlet("/albums/*")
public class Albums extends HttpServlet {
	private static final long serialVersionUID = 1L;
      

    public Albums() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = "";
		try{
			path = request.getPathInfo().substring(1).toLowerCase();
		} catch (NullPointerException e) {
			
		}
		System.out.println(path);
		
		JSONObject res = new JSONObject();
		PrintWriter out = response.getWriter();
		
		DBConnector db = new DBConnector();
		String sql = "";
		if(path.equals("")) {
			//sql = "SELECT * FROM Album LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId LIMIT 25";
			sql = "SELECT Album.*, Track.TrackId, Artist.Name FROM Album LEFT JOIN Artist ON Album.ArtistId = Artist.ArtistId LEFT JOIN Track ON Track.AlbumId = Album.AlbumId ORDER BY Album.AlbumId";
		} else {
			sql = "SELECT * FROM Album WHERE AlbumID = "+ path;
		}
		
		Boolean singleRecord = false;
		try {
			res = db.queryDB(sql, "Album", singleRecord);
		} catch (SQLException e) {

			e.printStackTrace();
		}
		response.setContentType("application/json");
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    response.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
	    response.addHeader("Access-Control-Allow-Headers", "Content-Type");
	    response.addHeader("Access-Control-Max-Age", "86400");

		out.print(res);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doGet(request, response);
	}

}
