<?php
/**
 * NOVA Marketplace — AdminController
 */

namespace Controllers\Admin;

use Core\Controller;
use Config\Database;
use PDO;

class AdminController extends Controller {
    /**
     * Render the admin dashboard with general statistics.
     */
    public function dashboard(): void {
        $db = Database::getConnection();
        
        // Fetch stats count dynamically
        $stmtUsers = $db->query("SELECT COUNT(*) FROM `users`");
        $totalUsers = $stmtUsers->fetchColumn();

        $stmtCars = $db->query("SELECT COUNT(*) FROM `cars`");
        $totalCars = $stmtCars->fetchColumn();

        $stmtProps = $db->query("SELECT COUNT(*) FROM `properties`");
        $totalProperties = $stmtProps->fetchColumn();

        $stmtLeads = $db->query("SELECT COUNT(*) FROM `leads`");
        $totalLeads = $stmtLeads->fetchColumn();

        $this->render('admin/dashboard', [
            'totalUsers' => $totalUsers,
            'totalCars' => $totalCars,
            'totalProperties' => $totalProperties,
            'totalLeads' => $totalLeads
        ], 'layouts/admin');
    }
}
