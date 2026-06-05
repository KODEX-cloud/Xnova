<?php
/**
 * NOVA Marketplace — Admin Leads Inbox View
 */
?>
<div style="margin-bottom: 2rem;">
    <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--slate-900);">Boîte de Réception des Leads</h1>
    <p style="color: var(--slate-500);">Consultez les messages de contact général et les demandes de fiches (automobiles/immobilières)</p>
</div>

<?php if (!empty($success)): ?>
    <div class="alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); padding: 1rem; border-radius: var(--radius-md); font-weight: 500; margin-bottom: 1.5rem;">
        <?= htmlspecialchars($error) ?>
    </div>
<?php endif; ?>

<!-- Tabs navigation -->
<div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--slate-200); margin-bottom: 2rem; padding-bottom: 0.5rem;">
    <button onclick="switchTab('leads-tab', 'contacts-tab')" class="tab-btn active-tab" id="leads-btn" style="background: none; border: none; font-size: 1.05rem; font-weight: 700; color: var(--nova-red); border-bottom: 3px solid var(--nova-red); padding: 0.5rem 1rem; cursor: pointer;">
        Demandes d'annonces (Leads) (<?= count($leads) ?>)
    </button>
    <button onclick="switchTab('contacts-tab', 'leads-tab')" class="tab-btn" id="contacts-btn" style="background: none; border: none; font-size: 1.05rem; font-weight: 700; color: var(--slate-500); padding: 0.5rem 1rem; cursor: pointer;">
        Messages de Contact (<?= count($contactMessages) ?>)
    </button>
</div>

<!-- Tab 1: Leads -->
<div id="leads-tab" class="admin-card tab-content">
    <h2 class="admin-card-title">Leads de fiches auto/immo</h2>
    
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Client</th>
                <th style="padding: 1rem 0.75rem;">Contact</th>
                <th style="padding: 1rem 0.75rem;">Type Lead</th>
                <th style="padding: 1rem 0.75rem;">Annonce Concernée</th>
                <th style="padding: 1rem 0.75rem;">Date</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($leads)): ?>
                <tr>
                    <td colspan="7" style="padding: 2rem 0.75rem; text-align: center; color: var(--slate-400);">Aucune demande reçue pour le moment.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($leads as $lead): ?>
                    <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700); <?= !$lead['is_read'] ? 'background-color: rgba(255, 85, 0, 0.02); font-weight: 600;' : '' ?>">
                        <td style="padding: 1rem 0.75rem; color: var(--slate-900);">
                            <?= htmlspecialchars($lead['name'] ?? 'Anonyme') ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem; color: var(--slate-600);">
                            <?= htmlspecialchars($lead['email'] ?? '') ?><br>
                            <span style="color: var(--slate-400);"><?= htmlspecialchars($lead['phone'] ?? '') ?></span>
                        </td>
                        <td style="padding: 1rem 0.75rem;">
                            <span style="background-color: var(--slate-150); color: var(--slate-700); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                                <?= htmlspecialchars($lead['type']) ?>
                            </span>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem;">
                            <?= htmlspecialchars($lead['listing_type'] === 'car' ? 'Voiture' : 'Immobilier') ?> (ID: <code style="font-size:0.75rem;"><?= htmlspecialchars($lead['listing_id'] ?? '') ?></code>)
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem; color: var(--slate-500);">
                            <?= date('d/m/Y H:i', strtotime($lead['created_at'])) ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: center;">
                            <?php if ($lead['is_read']): ?>
                                <span style="color: var(--slate-400); font-size: 0.85rem;">Lu</span>
                            <?php else: ?>
                                <span style="background-color: rgba(255, 85, 0, 0.1); color: var(--nova-orange); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Nouveau</span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: right; white-space: nowrap;">
                            <a href="<?= BASE_URL ?>/admin/leads/view/<?= $lead['id'] ?>" style="color: var(--nova-red); font-weight: 600; margin-right: 1rem; text-decoration: none;">Voir</a>
                            
                            <form action="<?= BASE_URL ?>/admin/leads/toggle/<?= $lead['id'] ?>" method="POST" style="display: inline; margin-right: 1rem;">
                                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                <button type="submit" style="background: none; border: none; color: var(--slate-500); font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit;">
                                    Marquer <?= $lead['is_read'] ? 'Non Lu' : 'Lu' ?>
                                </button>
                            </form>
                            
                            <form action="<?= BASE_URL ?>/admin/leads/delete/<?= $lead['id'] ?>" method="POST" style="display: inline;" onsubmit="return confirm('Supprimer ce lead ?');">
                                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                <button type="submit" style="background: none; border: none; color: var(--danger); font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit;">Supprimer</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- Tab 2: Contact Messages -->
<div id="contacts-tab" class="admin-card tab-content" style="display: none;">
    <h2 class="admin-card-title">Messages de contact général</h2>
    
    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
        <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-500); font-weight: 600;">
                <th style="padding: 1rem 0.75rem;">Expéditeur</th>
                <th style="padding: 1rem 0.75rem;">Contact</th>
                <th style="padding: 1rem 0.75rem;">Sujet</th>
                <th style="padding: 1rem 0.75rem;">Date</th>
                <th style="padding: 1rem 0.75rem; text-align: center;">Statut</th>
                <th style="padding: 1rem 0.75rem; text-align: right;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($contactMessages)): ?>
                <tr>
                    <td colspan="6" style="padding: 2rem 0.75rem; text-align: center; color: var(--slate-400);">Aucun message reçu.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($contactMessages as $msg): ?>
                    <tr style="border-bottom: 1px solid var(--slate-150); color: var(--slate-700); <?= !$msg['is_read'] ? 'background-color: rgba(255, 0, 85, 0.02); font-weight: 600;' : '' ?>">
                        <td style="padding: 1rem 0.75rem; color: var(--slate-900);">
                            <?= htmlspecialchars($msg['name']) ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem; color: var(--slate-600);">
                            <?= htmlspecialchars($msg['email']) ?><br>
                            <span style="color: var(--slate-400);"><?= htmlspecialchars($msg['phone'] ?? '') ?></span>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem;">
                            <?= htmlspecialchars($msg['subject'] ?? 'Sans sujet') ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; font-size: 0.85rem; color: var(--slate-500);">
                            <?= date('d/m/Y H:i', strtotime($msg['created_at'])) ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: center;">
                            <?php if ($msg['is_read']): ?>
                                <span style="color: var(--slate-400); font-size: 0.85rem;">Lu</span>
                            <?php else: ?>
                                <span style="background-color: rgba(255, 0, 85, 0.1); color: var(--nova-red); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">Nouveau</span>
                            <?php endif; ?>
                        </td>
                        <td style="padding: 1rem 0.75rem; text-align: right; white-space: nowrap;">
                            <a href="<?= BASE_URL ?>/admin/leads/view/<?= $msg['id'] ?>" style="color: var(--nova-red); font-weight: 600; margin-right: 1rem; text-decoration: none;">Lire</a>
                            
                            <form action="<?= BASE_URL ?>/admin/leads/toggle/<?= $msg['id'] ?>" method="POST" style="display: inline; margin-right: 1rem;">
                                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                <button type="submit" style="background: none; border: none; color: var(--slate-500); font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit;">
                                    Marquer <?= $msg['is_read'] ? 'Non Lu' : 'Lu' ?>
                                </button>
                            </form>
                            
                            <form action="<?= BASE_URL ?>/admin/leads/delete/<?= $msg['id'] ?>" method="POST" style="display: inline;" onsubmit="return confirm('Supprimer ce message ?');">
                                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                                <button type="submit" style="background: none; border: none; color: var(--danger); font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; font-size: inherit;">Supprimer</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<script>
function switchTab(showId, hideId) {
    document.getElementById(showId).style.display = 'block';
    document.getElementById(hideId).style.display = 'none';
    
    if (showId === 'leads-tab') {
        document.getElementById('leads-btn').classList.add('active-tab');
        document.getElementById('leads-btn').style.borderBottom = '3px solid var(--nova-red)';
        document.getElementById('leads-btn').style.color = 'var(--nova-red)';
        
        document.getElementById('contacts-btn').classList.remove('active-tab');
        document.getElementById('contacts-btn').style.borderBottom = 'none';
        document.getElementById('contacts-btn').style.color = 'var(--slate-500)';
    } else {
        document.getElementById('contacts-btn').classList.add('active-tab');
        document.getElementById('contacts-btn').style.borderBottom = '3px solid var(--nova-red)';
        document.getElementById('contacts-btn').style.color = 'var(--nova-red)';
        
        document.getElementById('leads-btn').classList.remove('active-tab');
        document.getElementById('leads-btn').style.borderBottom = 'none';
        document.getElementById('leads-btn').style.color = 'var(--slate-500)';
    }
}
</script>
