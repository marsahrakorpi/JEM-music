<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\BaseController;

use Rennokki\Larafy\Larafy; //spotify

use Illuminate\Http\Request;

class SpotifyController extends BaseController
{
    protected $bearerToken;

    public function authenticate() {
        die('Basic '.base64_encode(getenv('SPOTIFY_KEY').':'.getenv('SPOTIFY_SECRET')));
        $client = new \GuzzleHttp\Client();
        try {
            $request = $client->request('POST', 'https://accounts.spotify.com/api/token', [
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded',
                    'Accepts' => 'application/json',
                    'Authorization' => 'Basic '.base64_encode(getenv('SPOTIFY_KEY').':'.getenv('SPOTIFY_SECRET')),
                ],
                'form_params' => [
                    'grant_type' => 'client_credentials',
                ],
            ]);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            throw new SpotifyAPIException('Spotify API cannot generate the Client Credentials Token.', json_decode($e->getResponse()->getBody()->getContents()));
        }
        $response = json_decode($request->getBody());
        $clientCredentialsToken = $response->access_token;

        return $clientCredentialsToken;
    }
}
