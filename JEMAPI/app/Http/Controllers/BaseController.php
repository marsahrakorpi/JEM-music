<?php namespace App\Http\Controllers;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as TheBaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
abstract class BaseController extends TheBaseController {
	use DispatchesJobs, ValidatesRequests;
}