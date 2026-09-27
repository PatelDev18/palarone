import os

dirs = [
    r"d:\2026062\polarone\apps\api\app\models",
    r"d:\2026062\polarone\apps\api\app\schemas",
    r"d:\2026062\polarone\apps\api\app\crud",
    r"d:\2026062\polarone\apps\api\app\api\v1",
    r"d:\2026062\polarone\apps\api\app\db",
    r"d:\2026062\polarone\apps\api\app\core",
]
for d in dirs:
    os.makedirs(d, exist_ok=True)
