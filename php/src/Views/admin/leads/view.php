<?php
/**
 * NOVA Marketplace — View Lead Details
 */
$isMsg = $lead['is_contact_message'] ?? false;
?>
<div style="margin-bottom: 2rem;">
    <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.9rem; color: var(--slate-500); margin-bottom: 0.5rem;">
        <a href="<?= BASE_URL ?>/admin/leads" style="color: var(--slate-500); font-weight: 500;">Inbox</a>
        <span>&rsaquo;</span>
        <span>Détails</span>
    </div>
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">
        <?= $isMsg ? 'Message de contact' : 'Demande d\'annonce' ?>
    </h1>
</div>

<div class="admin-card" style="max-width: 800px;">
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--slate-200); padding-bottom: 1.5rem; margin-bottom: 1.5rem; align-items: start;">
        <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--slate-900); margin-bottom: 0.25rem;">
                <?= htmlspecialchars($lead['name'] ?? 'Nom non fourni') ?>
            </h2>
            <p style="color: var(--slate-500); font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem;">
                <span><strong>Email:</strong> <?= htmlspecialchars($lead['email'] ?? 'Non fourni') ?></span>
                <span><strong>Téléphone:</strong> <?= htmlspecialchars($lead['phone'] ?? 'Non fourni') ?></span>
                <span><strong>Date de réception:</strong> <?= date('d/m/Y H:i:s', strtotime($lead['created_at'])) ?></span>
            </p>
        </div>
        <span style="background-color: var(--slate-150); color: var(--slate-700); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase;">
            <?= htmlspecialchars($lead['type'] ?? ($isMsg ? 'CONTACT' : 'DEMANDE')) ?>
        </span>
    </div>

    <?php if (!$isMsg): ?>
        <div style="background-color: var(--slate-50); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--slate-200); margin-bottom: 1.5rem;">
            <h3 style="font-size: 0.9rem; font-weight: 700; color: var(--slate-800); text-transform: uppercase; margin-bottom: 0.5rem; color: var(--nova-orange);">
                Informations sur l'annonce
            </h3>
            <p style="font-size: 0.95rem; color: var(--slate-600); margin: 0;">
                <strong>Type de bien:</strong> <?= htmlspecialchars($lead['listing_type'] === 'car' ? 'Automobile (Voiture)' : 'Immobilier (Propriété)') ?><br>
                <strong>ID de l'annonce:</strong> <code style="font-size: 0.85rem;"><?= htmlspecialchars($lead['listing_id'] ?? '') ?></code>
            </p>
            <div style="margin-top: 1rem;">
                <a href="<?= BASE_URL ?>/<?= $lead['listing_type'] === 'car' ? 'automobile' : 'immobilier' ?>/<?= $lead['listing_id'] ?>" target="_blank" style="color: var(--nova-red); font-weight: 700; text-decoration: none; font-size: 0.9rem;">
                    Voir la fiche publique &rarr;
                </a>
            </div>
        </div>
    <?php endif; ?>

    <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 0.9rem; font-weight: 700; color: var(--slate-800); text-transform: uppercase; margin-bottom: 0.5rem;">
            <?= $isMsg ? 'Sujet : ' . htmlspecialchars($lead['subject'] ?? 'Sans sujet') : 'Message ou questions du client' ?>
        </h3>
        <div style="background-color: var(--slate-50); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--slate-150); line-height: 1.6; color: var(--slate-800); white-space: pre-wrap; font-size: 1rem;">
            <?= htmlspecialchars($lead['message'] ?? 'Aucun message saisi.') ?>
        </div>
    </div>

    <div style="display: flex; gap: 1rem; border-top: 1px solid var(--slate-200); padding-top: 1.5rem;">
        <a href="mailto:<?= htmlspecialchars($lead['email']) ?>?subject=Réponse NOVA Marketplace : <?= htmlspecialchars($lead['subject'] ?? 'Votre demande') ?>" class="btn-submit" style="text-decoration: none;">
            Répondre par Email
        </a>
        <?php if (!empty($lead['phone'])): ?>
            <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $lead['phone']) ?>" target="_blank" style="background-color: #25D366; color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; text-align: center;">
                Contacter via WhatsApp
            </a>
        <?php endif; ?>
        <a href="<?= BASE_URL ?>/admin/leads" style="background-color: var(--slate-200); color: var(--slate-700); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; text-align: center; margin-left: auto;">
            Retour à la boîte de réception
        </a>
    </div>
</div>
