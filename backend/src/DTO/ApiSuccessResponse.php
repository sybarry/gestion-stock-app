<?php
namespace App\DTO;

use ApiPlatform\Metadata\ApiResource;

#[ApiResource(output: false)]

#[ApiResource(output: false)]
class ApiSuccessResponse
{
    public string $message;
    public $data;

    public function __construct(string $message, $data)
    {
        $this->message = $message;
        $this->data = $data;
    }
}
