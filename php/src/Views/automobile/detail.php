<?php
/**
 * NOVA Marketplace — Public Car Detail View
 */
?>
<section class="section" style="background-color: var(--slate-50);">
    <div class="container">
        
        <!-- Back Link -->
        <div style="margin-bottom: 1.5rem;">
            <a href="<?= BASE_URL ?>/automobile" style="font-size: 0.9rem; color: var(--slate-500); font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem;">
                &larr; Retour aux voitures
            </a>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2.5rem; align-items: start;">
            
            <!-- Left Side: Images and Description -->
            <div>
                <!-- Main Gallery -->
                <div style="background-color: white; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
                    <div style="position: relative; padding-top: 56.25%; background-color: var(--slate-100);">
                        <?php if (!empty($images)): ?>
                            <img src="<?= BASE_URL . $images[0] ?>" alt="<?= htmlspecialchars($car['title']) ?>" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;">
                        <?php else: ?>
                            <img src="<?= BASE_URL ?>/assets/img/default-car.jpg" alt="No image" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover;">
                        <?php endif; ?>
                    </div>
                    
                    <!-- Thumbnails row -->
                    <?php if (count($images) > 1): ?>
                        <div style="display: flex; gap: 1rem; padding: 1rem; border-top: 1px solid var(--slate-200); overflow-x: auto;">
                            <?php foreach ($images as $img): ?>
                                <div style="width: 80px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; border: 2px solid var(--slate-200);">
                                    <img src="<?= BASE_URL . $img ?>" alt="thumb" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Specs Grid -->
                <div style="background-color: white; padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 1.5rem; border-bottom: 2px solid var(--slate-100); padding-bottom: 0.5rem;">Fiche Technique</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                        <div>
                            <span style="display: block; font-size: 0.8rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">Marque / Modèle</span>
                            <span style="font-weight: 600; color: var(--slate-800);"><?= htmlspecialchars($car['brand'] ?? '-') ?> <?= htmlspecialchars($car['model'] ?? '') ?></span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.8rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">Année</span>
                            <span style="font-weight: 600; color: var(--slate-800);"><?= $car['year'] ?? '-' ?></span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.8rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">Kilométrage</span>
                            <span style="font-weight: 600; color: var(--slate-800);"><?= number_format($car['mileage'] ?? 0, 0, ',', ' ') ?> km</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.8rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">Boîte de Vitesse</span>
                            <span style="font-weight: 600; color: var(--slate-800);"><?= htmlspecialchars($car['transmission'] === 'AUTOMATIC' ? 'Automatique' : 'Manuelle') ?></span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.8rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">Carburant</span>
                            <span style="font-weight: 600; color: var(--slate-800);"><?= htmlspecialchars($car['fuel'] ?? '-') ?></span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 0.8rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase;">Couleur</span>
                            <span style="font-weight: 600; color: var(--slate-800);"><?= htmlspecialchars($car['color'] ?? '-') ?></span>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div style="background-color: white; padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 1rem; border-bottom: 2px solid var(--slate-100); padding-bottom: 0.5rem;">Description</h2>
                    <p style="color: var(--slate-600); white-space: pre-line; line-height: 1.7;"><?= htmlspecialchars($car['description'] ?? 'Aucune description fournie.') ?></p>
                </div>
            </div>

            <!-- Right Side: Pricing and Contact Card -->
            <div style="display: flex; flex-direction: column; gap: 2rem; position: sticky; top: 90px;">
                <!-- Pricing Card -->
                <div style="background-color: white; padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm);">
                    <span style="background-color: rgba(255, 0, 85, 0.1); color: var(--nova-red); padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">En Vente</span>
                    <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--nova-red); margin-top: 0.5rem; line-height: 1.1;"><?= number_format($car['price'], 0, ',', ' ') ?> <span style="font-size: 1.25rem; font-weight: 600;">FCFA</span></h1>
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900); margin-top: 1rem; line-height: 1.3;"><?= htmlspecialchars($car['title']) ?></h2>
                    <p style="color: var(--slate-500); font-size: 0.85rem; margin-top: 0.5rem;">Publié à <?= htmlspecialchars($car['city'] ?? '') ?>, <?= htmlspecialchars($car['location'] ?? '') ?></p>
                </div>

                <!-- Contact Seller Card -->
                <div style="background-color: white; padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); box-shadow: var(--shadow-sm); text-align: center;">
                    <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--slate-900); margin-bottom: 1.5rem;">Contacter le Vendeur</h3>
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                        <span style="font-weight: 700; color: var(--slate-800); font-size: 1.1rem;"><?= htmlspecialchars($car['owner_name'] ?? 'Conseiller NOVA') ?></span>
                        <span style="color: var(--slate-500); font-size: 0.9rem;"><?= htmlspecialchars($car['owner_phone'] ?? '+225 0707070707') ?></span>
                    </div>

                    <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $car['owner_phone'] ?? '2250707070707') ?>?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20l\'annonce%20<?= rawurlencode($car['title']) ?>" 
                       class="btn-publish" style="display: block; text-align: center; background: #25D366; box-shadow: none; font-weight:700; padding:0.85rem;" target="_blank">
                        Contacter via WhatsApp
                    </a>
                </div>
            </div>
            
        </div>
    </div>
</section>
