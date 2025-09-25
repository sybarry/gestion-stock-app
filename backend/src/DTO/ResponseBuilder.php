<?php
namespace App\DTO;

class ResponseBuilder
{
    public string $message;
    public $data;

    public function __construct(string $message, $data)
    {
        $this->message = $message;
        $this->data = $data;
    }
}
