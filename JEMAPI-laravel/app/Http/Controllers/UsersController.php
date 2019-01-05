<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Classes\userdb;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use ReallySimpleJWT\Token;

class UsersController extends JEMController
{
    protected $udb;
    function __construct(userdb $udb){
        $this->udb = $udb;
        $this->udb->connect();
    }

    private function hashPassword($psw){
        //hash user password
        $options = [
            'cost' => 12,
        ];
        $hashed_password = password_hash($psw, PASSWORD_BCRYPT, $options);
        return $hashed_password;
    }

    function register(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');

        if(empty($email)){
            return Response()->json("Missing Username Parameter", 422);
        } 
        if(empty($password)){
            return Response()-json("Missing Password Parameter", 422);
        }

        //check if email is already in use
        $hits = $this->udb->getUserWithEmail($email);

        if(!empty($hits)){
            return Response()->json("This email is already in use", 409);
        }

        $hashed_password = $this->hashPassword($password);

        $this->udb->createUser($email, $hashed_password);
        return Response()->json("Success", 200);
    }

    function login(Request $request){
        $grant_type=  $request->input('grant_type');
        $email = $request->input('username');
        $password = $request->input('password');

        if($grant_type!="password"){
            return Response()->json("Invalid Grant Type", 401);
        } 
        if(empty($email)){
            return Response()->json("Missing Username Parameter", 422);
        } 
        if(empty($password)){
            return Response()->json("Missing Password Parameter", 422);
        }

        //login user's hashed pasw from db
        $hashed_psw = $this->udb->getHashedPassword($email);
        if(!isset($hashed_psw)) return Response()->json("Invalid Credentials", 401);
        //reject if psw does not match
        $hashed_psw = current($hashed_psw)->Password;
        $timestamp = strtotime('01-01-2038');
        if(!password_verify($password, $hashed_psw)) return Response()->json("Invalid Credentials", 401);
        
        $user = $this->udb->getUserInfo($email);
        $userid = current($user)->id;
        // Generate a token
        $token = Token::getToken($userid, getenv('SECRET'), $timestamp, 'JEMAPI');

        // Validate the token
        $result = Token::validate($token, getenv('SECRET'));
        // Create token header as a JSON string
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

        // Create token payload as a JSON string
        $payload = json_encode(['user_id' => $userid]);

        // Encode Header to Base64Url String
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

        // Encode Payload to Base64Url String
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        // Create Signature Hash
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'abC123!', true);

        // Encode Signature to Base64Url String
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

        $res = new \stdClass();
        $res->access_token = $jwt;
        $res->user = $user;
        $res->token_type = "JWT";
  
        return Response()->json($res, 200);

        
    }

}

?>