package engine;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

/**
 * Servlet implementation class DatabaseConnector
 */
@WebServlet("/DatabaseQuery/*")
public class DatabaseQuery extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DatabaseQuery() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		String path = "";
		
		if(request.getParameterMap() != null) {
			String sqlParams = paramsToSQL(request.getParameterMap());
		}
		
		try {
			path = request.getPathInfo().substring(1).toLowerCase();
		} catch (NullPointerException e) {
			path = "";
		}
		

		switch (path) {
			case "":
				out.print("No route or table found for query");
				break;
			case "testconnection":
				testConnection(out);	
				break;
			default:
				out.print(queryDB(request));
		};

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	protected void testConnection(PrintWriter out) {
		
		DBConnection dbc = new DBConnection();
		JSONObject res  = dbc.testConnection("Track");
		
		Iterator<String> keys = res.keys();
		while(keys.hasNext()) {
		    String key = keys.next();
		    if (res.get(key) instanceof JSONObject) {
		    	out.println(res.get(key));
		    }
		}
		dbc.close();
		out.flush();
	}
	
	private JSONObject queryDB (HttpServletRequest request) {
		JSONObject queryResult = new JSONObject();
		
		String table = request.getPathInfo().substring(1).toLowerCase();
		String body = "";
		try {
			body = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		
		String sql = "SELECT * FROM "+table+" LIMIT 100 "+paramsToSQL(request.getParameterMap());
		
		DBConnection db = new DBConnection();
		queryResult = db.queryDB(sql);
		db.close();

		
		return queryResult;
		
	}

	private String paramsToSQL (Map<String, String[]> params) {
		String sql = "";
		
		Iterator<String> paramsIterator = params.keySet().iterator();
		if(params.isEmpty()) {
			return "";
		} else {
			sql += " WHERE ";
		}
		while(paramsIterator.hasNext()) {
			
			String qparam = paramsIterator.next();
			String[] value = params.get(qparam);
			
			String combined = qparam+"='"+value[0]+"'";
			
			sql += combined;
			if(paramsIterator.hasNext()) {
				sql += " AND ";
			}
		}
		
		return sql;
		
	}
	
}
