package routes;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import engine.DBConnector;

/**
 * Servlet implementation class tracks
 */
@WebServlet("/tracks/*")
public class Tracks extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Tracks() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String path = "";
		try{
			path = request.getPathInfo().substring(1).toLowerCase();
		} catch (NullPointerException e) {
			
		}
		
		JSONObject res = new JSONObject();
		PrintWriter out = response.getWriter();
		
		DBConnector db = new DBConnector();
		String sql = "";
		if(path.equals("")) {
			sql = "SELECT * FROM Track LEFT JOIN Album on Track.AlbumId = Album.albumId LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId LEFT JOIN Genre on Track.GenreId = Genre.GenreId ";
		} else {
			sql = "SELECT * FROM Track WHERE TrackId = "+path;
		}
		
		
		res = db.queryDB(sql, "Track");
		response.setContentType("application/json");
		out.print(res);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
