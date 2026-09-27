import os
import re

folder = r"d:\2026062\polarone\apps\web\components\command-center"
files = [os.path.join(folder, f) for f in os.listdir(folder) if f.endswith('.tsx')]

for path in files:
    with open(path, 'r', encoding='utf-8') as fl:
        content = fl.read()

    orig = content

    # 1. Backgrounds & Borders
    content = content.replace("bg-[#020617]", "bg-white dark:bg-[#020617]")
    content = content.replace("bg-[#0b1329]", "bg-white dark:bg-[#0b1329]")
    content = content.replace("bg-[#070d1e]", "bg-white dark:bg-[#070d1e]")
    content = content.replace("bg-slate-900/70", "bg-slate-50 dark:bg-slate-900/70")
    content = content.replace("bg-slate-900/60", "bg-slate-50 dark:bg-slate-900/60")
    content = content.replace("border-slate-800/80", "border-slate-200 dark:border-slate-800/80")
    content = content.replace("border-slate-800/90", "border-slate-200 dark:border-slate-800/90")
    content = content.replace("border-slate-800", "border-slate-200 dark:border-slate-800")
    content = content.replace("border-slate-700/80", "border-slate-200 dark:border-slate-700/80")
    content = content.replace("border-slate-700", "border-slate-200 dark:border-slate-700")

    # 2. Text colors
    content = re.sub(
        r'\btext-2xl font-bold font-mono text-slate-100\b',
        'text-2xl font-bold font-mono text-slate-900 dark:text-slate-100',
        content
    )
    content = re.sub(
        r'\btext-xl font-bold font-mono text-slate-100\b',
        'text-xl font-bold font-mono text-slate-900 dark:text-slate-100',
        content
    )
    content = re.sub(
        r'\btext-lg font-bold font-mono text-slate-100\b',
        'text-lg font-bold font-mono text-slate-900 dark:text-slate-100',
        content
    )
    content = re.sub(
        r'\btext-sm font-bold text-slate-100\b',
        'text-sm font-bold text-slate-900 dark:text-slate-100',
        content
    )
    content = re.sub(
        r'\btext-base font-bold text-slate-100\b',
        'text-base font-bold text-slate-900 dark:text-slate-100',
        content
    )
    content = re.sub(
        r'\btext-lg font-bold text-white\b',
        'text-lg font-bold text-slate-900 dark:text-white',
        content
    )
    content = re.sub(
        r'\btext-base font-bold text-white\b',
        'text-base font-bold text-slate-900 dark:text-white',
        content
    )
    content = re.sub(
        r'\bfont-bold text-white\b',
        'font-bold text-slate-900 dark:text-white',
        content
    )

    # 3. Secondary text
    content = re.sub(r'(?<!dark:)\btext-slate-400\b', 'text-slate-500 dark:text-slate-400', content)
    content = re.sub(r'(?<!dark:)\btext-slate-300\b', 'text-slate-700 dark:text-slate-300', content)

    # Clean double classes
    content = content.replace("dark:text-slate-500 dark:text-slate-400", "dark:text-slate-400")
    content = content.replace("dark:text-slate-700 dark:text-slate-300", "dark:text-slate-300")
    content = content.replace("dark:text-slate-900 dark:text-slate-100", "dark:text-slate-100")
    content = content.replace("dark:text-slate-900 dark:text-white", "dark:text-white")
    content = content.replace("dark:border-slate-200 dark:border-slate-800", "dark:border-slate-800")
    content = content.replace("dark:border-slate-200 dark:border-slate-700", "dark:border-slate-700")
    content = content.replace("dark:bg-white dark:bg-[#020617]", "dark:bg-[#020617]")
    content = content.replace("dark:bg-white dark:bg-[#0b1329]", "dark:bg-[#0b1329]")
    content = content.replace("dark:bg-white dark:bg-[#070d1e]", "dark:bg-[#070d1e]")

    if content != orig:
        with open(path, 'w', encoding='utf-8') as fl:
            fl.write(content)
        print(f"Updated {os.path.basename(path)}")

print("Done updating command-center components!")
