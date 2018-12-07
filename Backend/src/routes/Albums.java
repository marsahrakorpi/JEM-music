package routes;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import engine.DBConnector;

/**
 * Servlet implementation class Albums
 */
@WebServlet("/albums/*")
public class Albums extends HttpServlet {
	private static final long serialVersionUID = 1L;
      
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Albums() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
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
			sql = "SELECT * FROM Album LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId LIMIT 25";
		} else {
			sql = "SELECT * FROM Album WHERE AlbumID = "+ path;
		}
		
		
		res = db.queryDB(sql, "Album");
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
