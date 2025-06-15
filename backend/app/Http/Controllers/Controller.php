<?php



namespace App\Http\Controllers;

use OpenApi\Annotations as OA;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Nom de votre API",
 *     description="Description complète de votre API",
 *     @OA\Contact(
 *         email="contact@votre-api.com",
 *         name="Votre Équipe"
 *     ),
 *     @OA\License(
 *         name="Licence MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 *
  * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Serveur principal de l'API"
 * )
 */
/**
     * @OA\Get(
     *     path="/api/roles",
     *     summary="Liste des rôles",
     *     tags={"Rôles"},
     *     @OA\Response(
     *         response=200,
     *         description="Succès"
     *     )
     * )
     */

abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;
}
