<?php
/**
 * NOVA Marketplace — PageBuilderController (Admin Block Actions)
 */

namespace Controllers\Admin;

use Core\Controller;
use Core\Session;
use Models\Page;

class PageBuilderController extends Controller {
    /**
     * Decode and normalize sections from page record.
     */
    private function getNormalizedSections(array $page): array {
        $raw = json_decode($page['sections'], true) ?: [];
        $normalized = [];
        foreach ($raw as $index => $item) {
            if (is_string($item)) {
                $normalized[] = [
                    'id' => 'sec_' . $item . '_' . $index,
                    'type' => $item,
                    'active' => true
                ];
            } else if (is_array($item)) {
                $normalized[] = [
                    'id' => $item['id'] ?? 'sec_' . ($item['type'] ?? 'unknown') . '_' . $index,
                    'type' => $item['type'] ?? '',
                    'active' => isset($item['active']) ? (bool)$item['active'] : true
                ];
            }
        }
        return $normalized;
    }

    /**
     * Add a new section block to the page structure.
     */
    public function addSection(string $pageId): void {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::checkCsrfToken($csrfToken)) {
            Session::set('page_error', 'Sécurité CSRF invalide.');
            $this->redirect("/admin/pages/edit/{$pageId}");
        }

        $type = trim($_POST['type'] ?? '');
        if (empty($type)) {
            Session::set('page_error', 'Type de section non spécifié.');
            $this->redirect("/admin/pages/edit/{$pageId}");
        }

        $pageModel = new Page();
        $page = $pageModel->find($pageId);
        if (!$page) {
            Session::set('page_error', 'Page introuvable.');
            $this->redirect('/admin/pages');
        }

        $sections = $this->getNormalizedSections($page);
        $newSection = [
            'id' => 'sec_' . $type . '_' . uniqid(),
            'type' => $type,
            'active' => true
        ];
        $sections[] = $newSection;

        $pageModel->updateSections($pageId, $sections);
        Session::set('page_success', 'Section ajoutée avec succès !');
        $this->redirect("/admin/pages/edit/{$pageId}");
    }

    /**
     * Delete a section block.
     */
    public function deleteSection(string $pageId, string $sectionId): void {
        $pageModel = new Page();
        $page = $pageModel->find($pageId);
        if (!$page) {
            Session::set('page_error', 'Page introuvable.');
            $this->redirect('/admin/pages');
        }

        $sections = $this->getNormalizedSections($page);
        $filtered = array_filter($sections, function($item) use ($sectionId) {
            return $item['id'] !== $sectionId;
        });

        $pageModel->updateSections($pageId, array_values($filtered));
        Session::set('page_success', 'Section supprimée.');
        $this->redirect("/admin/pages/edit/{$pageId}");
    }

    /**
     * Toggle the active status of a section block.
     */
    public function toggleSection(string $pageId, string $sectionId): void {
        $pageModel = new Page();
        $page = $pageModel->find($pageId);
        if (!$page) {
            Session::set('page_error', 'Page introuvable.');
            $this->redirect('/admin/pages');
        }

        $sections = $this->getNormalizedSections($page);
        foreach ($sections as &$item) {
            if ($item['id'] === $sectionId) {
                $item['active'] = !$item['active'];
            }
        }

        $pageModel->updateSections($pageId, $sections);
        Session::set('page_success', 'Statut de la section mis à jour.');
        $this->redirect("/admin/pages/edit/{$pageId}");
    }

    /**
     * Move a section up or down.
     */
    public function moveSection(string $pageId, string $sectionId, string $direction): void {
        $pageModel = new Page();
        $page = $pageModel->find($pageId);
        if (!$page) {
            Session::set('page_error', 'Page introuvable.');
            $this->redirect('/admin/pages');
        }

        $sections = $this->getNormalizedSections($page);
        $targetIndex = -1;

        foreach ($sections as $index => $item) {
            if ($item['id'] === $sectionId) {
                $targetIndex = $index;
                break;
            }
        }

        if ($targetIndex !== -1) {
            $swapIndex = ($direction === 'up') ? $targetIndex - 1 : $targetIndex + 1;
            if ($swapIndex >= 0 && $swapIndex < count($sections)) {
                // Swap elements
                $temp = $sections[$targetIndex];
                $sections[$targetIndex] = $sections[$swapIndex];
                $sections[$swapIndex] = $temp;
                $pageModel->updateSections($pageId, $sections);
                Session::set('page_success', 'Section réordonnée.');
            }
        }

        $this->redirect("/admin/pages/edit/{$pageId}");
    }
}
