package engine;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.credentials.ClientCredentials;
import com.wrapper.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;

/**
 * Servlet implementation class SpotifyAuthentication
 */
@WebServlet("/SpotifyAuthentication")
public class SpotifyAuthentication extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SpotifyAuthentication() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
	    String spotify_ClientId = "40e7cf37f399406796151cd92509230b";
	    String spotify_ClientSecret = "2d11fc4ab38547739b14d8ce0b51a86e";
	    URI spotify_callbackUrl = null;
		try {
			spotify_callbackUrl = new URI("http://localhost:4200/callback");
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// TODO Auto-generated method stub
		SpotifyApi spotifyApi = new SpotifyApi.Builder()
				  .setClientId(spotify_ClientId)
				  .setClientSecret(spotify_ClientSecret)
				  .setRedirectUri(spotify_callbackUrl)
			  	  .build();
		  final ClientCredentialsRequest clientCredentialsRequest = spotifyApi.clientCredentials()
		          .build();
		  
		  	ClientCredentials clientCredentials = null;
		    try {
		        clientCredentials = clientCredentialsRequest.execute();

		        // Set access token for further "spotifyApi" object usage
		        spotifyApi.setAccessToken(clientCredentials.getAccessToken());

		        System.out.println("Expires in: " + clientCredentials.getExpiresIn());
		      } catch (IOException | SpotifyWebApiException e) {
		        System.out.println("Error: " + e.getMessage());
		      }
		//System.out.println(spotifyApi.getAccessToken());
		
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    response.addHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS, DELETE");
	    response.addHeader("Access-Control-Allow-Headers", "Content-Type");
	    response.addHeader("Access-Control-Max-Age", "86400");
		
		out.print(spotifyApi.getAccessToken());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}


}
