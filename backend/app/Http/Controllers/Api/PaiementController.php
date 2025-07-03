<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MoMoService;
use App\Services\MoMoTransaction;
use App\Services\Payer;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Paiement $paiement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paiement $paiement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paiement $paiement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paiement $paiement)
    {
        //
    }
    public function init()
    {

        $payerPhone = "674359141";
        $amount = "0.0015";
        $currency = "EUR";
        $externalId = "679064500";


        $payerMessage = "Test transaction";
        $payeeNote = "Test transaction aaa";

        $response = MoMoService::getApiKey();

        $apiKey = json_decode(json_decode($response, true)["response_body"],true)["apiKey"];

        $response = MoMoService::getAccessToken($apiKey);
        $accessToken = json_decode($response, true)["access_token"];

        $payer = new Payer("MSISDN",$payerPhone);
        $transactionReference = Uuid::uuid4()->toString();
        $momoTransaction = new MoMoTransaction(
            $amount,
            $currency,
            $externalId,
            $payer,
            $payerMessage,
            $payeeNote,
        );
        $response = MoMoService::requestToPay($accessToken, $momoTransaction,$transactionReference);
        return json_decode($response);




    }
}
