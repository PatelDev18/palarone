import os
import re

files_to_fix = [
    r"d:\2026062\polarone\apps\web\components\expeditions\ExpeditionCard.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\ExpeditionDetailView.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\CommanderDecisionBanner.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\ExpeditionTimelineView.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\ExpeditionMapView.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\RecentEventsFeed.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\ScenarioModal.tsx",
    r"d:\2026062\polarone\apps\web\components\expeditions\UpcomingMilestonesPanel.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\DataQualitySection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\EarthObservationWorkspace.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\GeospatialPipelineViewer.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\IceIntelligenceSection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\IntelligenceAlertsSection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\ModelRegistrySection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\RiskIntelligenceSection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\SatelliteCoveragePlanner.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\SatelliteIntelligenceSection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\SatelliteSceneModal.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\TimeMachineSection.tsx",
    r"d:\2026062\polarone\apps\web\components\intelligence\WeatherIntelligenceSection.tsx",
    r"d:\2026062\polarone\apps\web\app\expeditions\page.tsx",
    r"d:\2026062\polarone\apps\web\app\expeditions\[id]\page.tsx",
    r"d:\2026062\polarone\apps\web\app\expeditions\new\page.tsx"
]

for path in files_to_fix:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as fl:
        lines = fl.readlines()

    modified_lines = []
    file_modified = False

    for line in lines:
        mod = line
        
        # Check if line has text-white without dark:text-white
        if 'text-white' in mod and 'dark:text-white' not in mod:
            # Skip lines with solid colored buttons or badges
            is_colored = any(c in mod for c in [
                'bg-blue-6', 'bg-red-6', 'bg-emerald-6', 'bg-purple-6',
                'bg-rose-6', 'bg-amber-6', 'bg-rose-500', 'bg-red-500', 'bg-blue-500'
            ])
            if not is_colored:
                # Replace text-white with text-slate-900 dark:text-white
                mod = re.sub(r'(?<!dark:)\btext-white\b', 'text-slate-900 dark:text-white', mod)
                file_modified = True

        # Check for text-slate-200 inside strong or titles
        if '<strong className="text-slate-200">' in mod:
            mod = mod.replace('<strong className="text-slate-200">', '<strong className="text-slate-800 dark:text-slate-200">')
            file_modified = True
            
        modified_lines.append(mod)

    if file_modified:
        with open(path, 'w', encoding='utf-8') as fl:
            fl.writelines(modified_lines)
        print(f"Deep fixed {os.path.basename(path)}")

print("Done deep fixing remaining components!")
