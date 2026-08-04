$ErrorActionPreference = 'Stop'
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$html = Get-Content -Raw -Encoding UTF8 (Join-Path $root 'index.html')
$js = Get-Content -Raw -Encoding UTF8 (Join-Path $root 'js\lesson04.js')
$config = Get-Content -Raw -Encoding UTF8 (Join-Path $root 'js\lesson04-config.js')
$runtime = Get-Content -Raw -Encoding UTF8 (Join-Path $root 'js\ucan-compat-runtime.js')
function Assert-Check($ok,$name) { if(-not $ok){throw "FAIL: $name"}; "PASS: $name" }
Assert-Check (($html -split '<section[^>]+class="lesson-page').Count - 1 -eq 10) 'page count = 10'
$missingRoles = @('opening','theory','application','transition','resources','self-check','practice','assessment','completion') | Where-Object { $html -notmatch ('data-page-role="' + $_ + '"') }
Assert-Check ($missingRoles.Count -eq 0) 'page role set present'
$lessonMapRows = [regex]::Match($html, '(?s)<h2 id="map-title".*?<tbody>(?<rows>.*?)</tbody>').Groups['rows'].Value
$lessonMapEntries = [regex]::Matches($lessonMapRows, '<tr><td>\d+</td><td>([^<]+)</td>') | ForEach-Object { $_.Groups[1].Value }
$expectedLessonMapEntries = @('Початок','EU Cities Mission','Системний підхід','Як читати міжнародний кейс','Міжнародний досвід','Ресурси','Самоперевірка','Практичне завдання + AI','Підсумковий тест','Завершення')
Assert-Check ($lessonMapEntries.Count -eq 10) 'Route 1 Lesson Map contains exactly 10 entries'
Assert-Check (($lessonMapEntries -join '|') -eq ($expectedLessonMapEntries -join '|')) 'Route 1 Lesson Map follows the approved 10-entry order'
Assert-Check ($lessonMapRows -notmatch '<td>AI-підтримка</td>') 'Route 1 Lesson Map has no standalone AI entry'
Assert-Check ($lessonMapRows -match '<tr><td>8</td><td>Практичне завдання \+ AI</td>') 'Route 1 Lesson Map entry 8 is exactly Practical task + AI'
$answers = [regex]::Matches($js, "answer: '([ABCD])'") | ForEach-Object { $_.Groups[1].Value }
Assert-Check (($js -match "storageNamespace: 'ucan_l04_v1'") -and (($answers | Select-Object -Last 6) -join ',' -eq 'B,C,B,C,A,C')) 'namespace and assessment mapping'
$portfolioBlock = [regex]::Match($js, 'const portfolioFields = \[(?<fields>[\s\S]*?)\n\s*\];').Groups['fields'].Value
Assert-Check (([regex]::Matches($portfolioBlock, "\['")).Count -eq 13) 'portfolio fields = 13'
Assert-Check ($html -match 'css/tokens.css' -and $html -match 'css/ucan-components.css' -and $html -match 'css/lesson04.css') 'stylesheet links'
Assert-Check ($html -match 'js/lesson04-config.js' -and $html -match 'js/lesson04.js' -and $html -match 'js/ucan-compat-runtime.js') 'script links'
Assert-Check ((Get-Content -Raw (Join-Path $root 'css\style.css')) -match '--content: 1240px') '1240px shell'
Assert-Check ($html -match 'id="section-navigation"' -and $runtime -match "toggle\.textContent = 'Зміст заняття'") 'simple lesson contents control'
Assert-Check (-not ($html -match '\son\w+\s*=')) 'no inline handlers'
$ids = [regex]::Matches($html, '\sid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
Assert-Check (($ids | Group-Object | Where-Object Count -gt 1).Count -eq 0) 'no duplicate ids'
$domReferences = [regex]::Matches($js, "document\.getElementById\('([^']+)'\)") | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
Assert-Check (($domReferences | Where-Object { $_ -notin $ids }).Count -eq 0) 'static DOM references exist'
Assert-Check (-not (Test-Path (Join-Path $root 'js\script.js'))) 'legacy js/script.js absent'
Assert-Check ($html -notmatch 'js/script\.js') 'legacy js/script.js not linked'

$p08 = [regex]::Match($html, '(?s)<section[^>]+data-page-role="practice".*?</section>\s*<section[^>]+data-page-role="assessment"').Value
Assert-Check (([regex]::Matches($p08, 'data-approved-prompt="L04-AI-P0[123]"')).Count -eq 3 -and $p08 -match 'data-approved-prompt="L04-AI-P01"' -and $p08 -match 'data-approved-prompt="L04-AI-P02"' -and $p08 -match 'data-approved-prompt="L04-AI-P03"') 'P08 contains P01, P02 and P03 only'
Assert-Check (([regex]::Matches($p08, '>Копіювати промпт</button>')).Count -eq 3) 'P08 has exactly three learner-facing Copy prompt buttons'
Assert-Check ($p08 -match 'data-approved-prompt="L04-AI-P01"[^>]*>Копіювати промпт</button>' -and $p08 -match 'data-approved-prompt="L04-AI-P02"[^>]*>Копіювати промпт</button>' -and $p08 -match 'data-approved-prompt="L04-AI-P03"[^>]*>Копіювати промпт</button>') 'each approved prompt has its own Copy prompt action'
Assert-Check ($html -notmatch 'ai-prompt-preview|ai-prompt-dialog|prompt-panel|Прочитати запит|Переглянути промпт') 'learner-facing prompt preview workflow is absent'
Assert-Check ($js -match 'async function copyAiPrompt\(promptId\)' -and $js -match "buildAiPrompt\(promptId, getPortfolioData\(\)\)" -and $js -match 'Промпт скопійовано\. Відкрийте ChatGPT або Gemini та вставте його в чат\.') 'AI actions copy the approved payload with the approved success message'
Assert-Check ($html -notmatch 'data-page-role="support"' -and $html -notmatch 'p09-title') 'no separate AI page'
Assert-Check ($js -match 'button\.dataset\.approvedPrompt') 'practical AI actions use their own registry id'
Assert-Check ($html -notmatch 'name="ai-mode"' -and $js -notmatch 'ai-mode') 'obsolete selector absent'
Assert-Check ($html -notmatch '(?i)\bhelp\b|\breview\b' -and $js -notmatch '(?i)\bhelp\b|\breview\b') 'generic help and review absent'
Assert-Check ($js -match 'window\.UCAN_L04_APPROVED_PROMPTS\?\.\[promptId\]' -and $js -notmatch 'modeInstructions') 'approved registry is the only prompt builder source'
Assert-Check ($js -match 'assessmentPassed\s*&&\s*isPortfolioComplete\(\)' -and $js -match 'function isPortfolioComplete\(\)') 'combined completion gate checks assessment and portfolio'
Assert-Check ($js -match 'field\.value\.trim\(\)') 'portfolio completeness trims field values'
Assert-Check ($js -match 'Math\.round\(\(\(currentPage \+ 1\) / pages\.length\) \* 100\)' -and $js -notmatch 'visited\.size / pages\.length') 'progress uses current route position, not visited pages'
Assert-Check ($js -match 'showPage\(savedPage, \{ focus: true \}\)' -and $js -match "heading\.focus\(\{ preventScroll: true \}\)") 'initial and restored pages use controlled heading focus'
Assert-Check ($runtime -match "event\.key !== 'Escape' \|\| list\.hidden" -and $runtime -match 'toggle\.focus\(\)') 'Escape closes open contents and restores trigger focus'
Assert-Check ($js -match 'function completionRecoveryMessage\(\)' -and $js -match 'const recoveryMessage = isCompletionPage\(index\) \? completionRecoveryMessage\(\)' -and $js -match 'if \(notice && !restoredRecoveryMessage\)') 'single prioritized completion recovery announcement path'
Assert-Check ($js -match 'function renderAssessment\(\)[\s\S]*?status\.textContent = assessmentPassed && isPortfolioComplete\(\)' -and $js -notmatch "if \(assessmentPassed\) status\.textContent = 'Усі шість відповідей правильні\. Сторінка завершення відкрита\.'") 'assessment success cannot claim completion while portfolio is incomplete'
Assert-Check ($portfolioBlock -match "\['prior_context'" -and $html -match 'for="prior_context">[^<]*<span class="required-mark">' -and $html -match 'id="prior_context"[^>]*required=""' -and $html -notmatch 'for="prior_context">[^<]*<span class="optional-mark">') 'prior_context remains required and has no optional marker'
Assert-Check ($js -match 'function savePortfolio\(\)[\s\S]*?updateNavigation\(\)' -and $js -match 'function clearPortfolio\(\)[\s\S]*?updateNavigation\(\)') 'portfolio changes refresh the completion gate'
Assert-Check ($js -match 'function showPage\(index[\s\S]*?const recoveryMessage = isCompletionPage\(index\) \? completionRecoveryMessage\(\)' -and $js -match "index = pages\.findIndex\(page => page\.dataset\.pageRole === 'assessment'\)") 'restored completion page is safely guarded'
$resetBlock = [regex]::Match($js, 'function resetLearningProgress\(\)[\s\S]*?\n  \}').Value
Assert-Check ($resetBlock -match 'keys\.assessment' -and $resetBlock -match 'assessmentPassed\s*=\s*false' -and $resetBlock -notmatch 'keys\.portfolio') 'reset progress preserves portfolio data'
Assert-Check ($js -match 'function clearPortfolio\(\)[\s\S]*?storageRemove\(keys\.portfolio\)') 'delete portfolio follows its existing storage contract'
Assert-Check (([regex]::Matches($html, 'role="progressbar"')).Count -eq 1 -and $html -match '← Назад' -and $html -match 'Далі →' -and $js -match 'pageLabel\.textContent = `Сторінка \$\{pageNumber\} з \$\{total\}`' -and $js -match 'progressText\.textContent = `\$\{percent\}%`') 'single progress bar, page counter and course navigation labels'
Assert-Check ($html -match '← До Заняття 03' -and $html -match 'Перейти до Заняття 05 →') 'previous and next lesson links'

$registryMatch = [regex]::Match($config, 'window\.UCAN_L04_APPROVED_PROMPTS = Object\.freeze\((?<json>\{[\s\S]*\})\);')
Assert-Check ($registryMatch.Success) 'approved prompt registry present'
$registry = $registryMatch.Groups['json'].Value | ConvertFrom-Json
$sha = [Security.Cryptography.SHA256]::Create()
try {
  $expectedPromptHashes = @{ 'L04-AI-P01' = '089175b674533c933dc002dc9e815b5eff9156c9df5d57a564bf918fbc041e7a'; 'L04-AI-P02' = '6ccdca37ebf7060d5fc766c28cd234770158080544da9e3d991eefac80d5ff6c'; 'L04-AI-P03' = '4f1c14d5026a4c38104f83acc7bb5a24505ca31f6582771871eeab5ed55af6e3' }
  $promptHashesMatch = $true
  foreach ($id in $expectedPromptHashes.Keys) {
    $value = $registry.$id
    $actual = (($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($value)) | ForEach-Object { $_.ToString('x2') }) -join '')
    if ($actual -ne $expectedPromptHashes[$id]) { $promptHashesMatch = $false }
  }
  Assert-Check $promptHashesMatch 'exact P01/P02/P03 payload text preserved'
} finally { $sha.Dispose() }
Assert-Check (-not (git status --porcelain -- assets)) 'assets unchanged'
Assert-Check (-not (git status --porcelain -- 'js/lesson04-config.js')) 'approved prompt registry file unchanged'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  & $nodeCommand.Source --check (Join-Path $root 'js\lesson04-config.js')
  & $nodeCommand.Source --check (Join-Path $root 'js\lesson04.js')
  & $nodeCommand.Source --check (Join-Path $root 'js\ucan-compat-runtime.js')
} else {
  $javascriptChanges = @(git status --porcelain -- 'js/lesson04-config.js' 'js/lesson04.js' 'js/ucan-compat-runtime.js')
  if ($javascriptChanges.Count -eq 0) {
    Assert-Check $true 'JavaScript files unchanged; syntax checks not required'
  } else {
    'SKIP: Node CLI is unavailable; changed JavaScript syntax requires runtime verification.'
  }
}
"STATIC_CHECKS_PASS"
