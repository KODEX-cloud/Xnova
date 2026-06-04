<?php
/**
 * NOVA Marketplace — User Model
 */

namespace Models;

use Core\Model;
use PDO;

class User extends Model {
    protected string $table = 'users';

    /**
     * Find a user by their email address.
     * 
     * @param string $email
     * @return array|null
     */
    public function findByEmail(string $email): ?array {
        return $this->findBy('email', $email);
    }
}
