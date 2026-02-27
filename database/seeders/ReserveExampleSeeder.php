<?php

namespace Database\Seeders;

use App\Models\Categor;
use App\Models\ReserveExample;
use Illuminate\Database\Seeder;

class ReserveExampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les catégories
        $plomberie = Categor::where('name', 'Plomberie')->first();
        $electricite = Categor::where('name', 'Électricité')->first();
        $peinture = Categor::where('name', 'Peinture')->first();
        $menuiserie = Categor::where('name', 'Menuiserie')->first();
        $carrelage = Categor::where('name', 'Carrelage')->first();

        $examples = [
            // Plomberie
            [
                'title' => 'Fuite d\'eau au robinet',
                'description' => 'Le robinet de la cuisine fuit continuellement. L\'eau coule même quand le robinet est fermé. Il y a une petite flaque d\'eau qui se forme sous l\'évier.',
                'categor_id' => $plomberie?->id,
                'priority' => 'moyenne',
                'photo_path' => 'plomberie-fuite-robinet.jpg',
                'order' => 1,
            ],
            [
                'title' => 'Fuite d\'eau dans la salle de bain',
                'description' => 'Fuite d\'eau importante dans la salle de bain. L\'eau coule du plafond ou des murs. Il y a des taches d\'humidité visibles.',
                'categor_id' => $plomberie?->id,
                'priority' => 'haute',
                'photo_path' => 'examples/plomberie-fuite-salle-bain.jpg',
                'order' => 2,
            ],
            [
                'title' => 'Toilettes bouchées',
                'description' => 'Les toilettes ne se vident pas correctement. L\'eau monte quand on tire la chasse. Il y a un risque de débordement.',
                'categor_id' => $plomberie?->id,
                'priority' => 'haute',
                'photo_path' => 'examples/plomberie-toilettes-bouchees.jpg',
                'order' => 3,
            ],
            [
                'title' => 'Robinet qui goutte',
                'description' => 'Le robinet de la salle de bain ou de la cuisine goutte constamment. C\'est gênant et ça fait du bruit la nuit.',
                'categor_id' => $plomberie?->id,
                'priority' => 'basse',
                'photo_path' => 'examples/plomberie-robinet-goutte.jpg',
                'order' => 4,
            ],

            // Électricité
            [
                'title' => 'Prise électrique qui ne fonctionne pas',
                'description' => 'Une ou plusieurs prises électriques ne fonctionnent plus. Aucun appareil ne se charge quand on les branche. Il n\'y a pas de courant.',
                'categor_id' => $electricite?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/electricite-prise-defectueuse.jpg',
                'order' => 5,
            ],
            [
                'title' => 'Interrupteur défectueux',
                'description' => 'L\'interrupteur ne fonctionne plus correctement. La lumière ne s\'allume pas ou clignote. Il faut appuyer plusieurs fois pour que ça marche.',
                'categor_id' => $electricite?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/electricite-interrupteur-defectueux.jpg',
                'order' => 6,
            ],
            [
                'title' => 'Court-circuit ou étincelles',
                'description' => 'Il y a des étincelles quand on branche un appareil. L\'interrupteur fait des étincelles. Il y a une odeur de brûlé. C\'est dangereux !',
                'categor_id' => $electricite?->id,
                'priority' => 'haute',
                'photo_path' => 'examples/electricite-court-circuit.jpg',
                'order' => 7,
            ],
            [
                'title' => 'Ampoule qui clignote',
                'description' => 'Les ampoules clignotent ou s\'éteignent de manière aléatoire. La lumière n\'est pas stable.',
                'categor_id' => $electricite?->id,
                'priority' => 'basse',
                'photo_path' => 'examples/electricite-ampoule-clignote.jpg',
                'order' => 8,
            ],

            // Peinture
            [
                'title' => 'Fissure dans le mur',
                'description' => 'Il y a une ou plusieurs fissures visibles dans le mur. La fissure s\'agrandit avec le temps. La peinture s\'écaille autour.',
                'categor_id' => $peinture?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/peinture-fissure-mur.jpg',
                'order' => 9,
            ],
            [
                'title' => 'Peinture qui s\'écaille',
                'description' => 'La peinture s\'écaille et se décolle du mur ou du plafond. Il y a des morceaux de peinture qui tombent.',
                'categor_id' => $peinture?->id,
                'priority' => 'basse',
                'photo_path' => 'examples/peinture-ecaille.jpg',
                'order' => 10,
            ],
            [
                'title' => 'Taches d\'humidité sur le mur',
                'description' => 'Il y a des taches d\'humidité ou de moisissure sur les murs. La peinture change de couleur à cause de l\'humidité.',
                'categor_id' => $peinture?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/peinture-taches-humidite.jpg',
                'order' => 11,
            ],

            // Menuiserie
            [
                'title' => 'Porte qui ne ferme pas',
                'description' => 'La porte ne se ferme pas correctement. Elle reste entrouverte ou il faut forcer pour la fermer. La serrure ne fonctionne pas bien.',
                'categor_id' => $menuiserie?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/menuiserie-porte-ne-ferme-pas.jpg',
                'order' => 12,
            ],
            [
                'title' => 'Fenêtre qui ne s\'ouvre pas',
                'description' => 'La fenêtre est bloquée et ne s\'ouvre plus. Elle est difficile à ouvrir ou complètement coincée.',
                'categor_id' => $menuiserie?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/menuiserie-fenetre-bloquee.jpg',
                'order' => 13,
            ],
            [
                'title' => 'Placard qui grince',
                'description' => 'Les portes du placard grincement quand on les ouvre ou les ferme. Les charnières sont usées.',
                'categor_id' => $menuiserie?->id,
                'priority' => 'basse',
                'photo_path' => 'examples/menuiserie-placard-grince.jpg',
                'order' => 14,
            ],

            // Carrelage
            [
                'title' => 'Carrelage cassé ou fêlé',
                'description' => 'Un ou plusieurs carreaux sont cassés ou fêlés. Il y a des morceaux qui manquent. C\'est dangereux pour marcher dessus.',
                'categor_id' => $carrelage?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/carrelage-casse.jpg',
                'order' => 15,
            ],
            [
                'title' => 'Carrelage qui se décolle',
                'description' => 'Les carreaux se décollent du sol ou du mur. Ils bougent quand on marche dessus. Il y a des espaces entre les carreaux.',
                'categor_id' => $carrelage?->id,
                'priority' => 'moyenne',
                'photo_path' => 'examples/carrelage-decolle.jpg',
                'order' => 16,
            ],
        ];

        foreach ($examples as $example) {
            if ($example['categor_id']) {
                ReserveExample::updateOrCreate(
                    ['title' => $example['title']], // Recherche par titre unique
                    $example
                );
            }
        }

        $this->command->info('Exemples de réserves créés avec succès !');
    }
}
