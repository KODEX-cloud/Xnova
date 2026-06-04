<?php
/**
 * NOVA Marketplace — MediaController
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Media;

class MediaController extends Controller {
    /**
     * Display the media library interface.
     */
    public function index(): void {
        $mediaModel = new Media();
        $medias = $mediaModel->getAllDesc();
        
        $csrfToken = Session::generateCsrfToken();
        $this->render('admin/medias/index', [
            'medias' => $medias,
            'csrfToken' => $csrfToken,
            'success' => Session::get('media_success'),
            'error' => Session::get('media_error')
        ], 'layouts/admin');

        // Clear session messages
        Session::delete('media_success');
        Session::delete('media_error');
    }

    /**
     * Process multi-format secure image uploads.
     */
    public function upload(): void {
        // Validate CSRF
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('media_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/medias');
        }

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Session::set('media_error', 'Une erreur est survenue lors du téléversement.');
            $this->redirect('/admin/medias');
        }

        $file = $_FILES['file'];
        
        // Strict server-side MIME type verification (do not rely on file name)
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedMimeTypes)) {
            Session::set('media_error', 'Type de fichier non autorisé. Uniquement images JPEG, PNG, GIF ou WEBP.');
            $this->redirect('/admin/medias');
        }

        // Limit size (ex: 5MB)
        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            Session::set('media_error', 'Fichier trop lourd. Limite fixée à 5 Mo.');
            $this->redirect('/admin/medias');
        }

        // Ensure upload directory exists
        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }

        // Clean and rename file to avoid namespace collisions and path traversal exploits
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $cleanFilename = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
        $newFilename = $cleanFilename . '_' . time() . '.' . $extension;
        $destination = UPLOAD_DIR . '/' . $newFilename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            // Get dimensions
            $width = null;
            $height = null;
            $dims = getimagesize($destination);
            if ($dims) {
                $width = $dims[0];
                $height = $dims[1];
            }

            // Create record in database
            $mediaModel = new Media();
            
            // Dynamic URL matching public structure
            $fileUrl = '/uploads/' . $newFilename;

            $mediaModel->create([
                'id' => uniqid('med-'),
                'url' => $fileUrl,
                'filename' => $newFilename,
                'mimetype' => $mimeType,
                'size' => $file['size'],
                'alt' => $file['name'],
                'folder' => 'general',
                'width' => $width,
                'height' => $height
            ]);

            Session::set('media_success', 'Image téléversée avec succès !');
        } else {
            Session::set('media_error', 'Impossible de copier le fichier sur le disque.');
        }

        $this->redirect('/admin/medias');
    }

    /**
     * Delete a media item physically from disk and database records.
     */
    public function delete(string $id): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('media_error', 'Sécurité CSRF invalide.');
            $this->redirect('/admin/medias');
        }

        $mediaModel = new Media();
        $media = $mediaModel->find($id);

        if ($media) {
            // Delete physical file
            $filePath = ROOT_PATH . '/public' . $media['url'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Delete database record
            $mediaModel->delete($id);
            Session::set('media_success', 'Fichier média supprimé avec succès.');
        } else {
            Session::set('media_error', 'Média non trouvé.');
        }

        $this->redirect('/admin/medias');
    }
}
