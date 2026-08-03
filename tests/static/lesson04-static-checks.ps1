$ErrorActionPreference = 'Stop'
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$html = Get-Content -Raw (Join-Path $root 'index.html')
$js = Get-Content -Raw (Join-Path $root 'js\lesson04.js')
$config = Get-Content -Raw (Join-Path $root 'js\lesson04-config.js')
function Assert-Check($ok,$name) { if(-not $ok){throw "FAIL: $name"}; "PASS: $name" }
Assert-Check (($html -split '<section[^>]+class="lesson-page').Count - 1 -eq 11) 'page count = 11'
$missingRoles = @('opening','theory','application','transition','resources','self-check','practice','support','assessment','completion') | Where-Object { $html -notmatch ('data-page-role="' + $_ + '"') }
Assert-Check ($missingRoles.Count -eq 0) 'page role set present'
$answers = [regex]::Matches($js, "answer: '([ABCD])'") | ForEach-Object { $_.Groups[1].Value }
Assert-Check (($js -match "storageNamespace: 'ucan_l04_v1'") -and (($answers | Select-Object -Last 6) -join ',' -eq 'B,C,B,C,A,C')) 'namespace and assessment mapping'
$portfolioBlock = [regex]::Match($js, 'const portfolioFields = \[(?<fields>[\s\S]*?)\n\s*\];').Groups['fields'].Value
Assert-Check (([regex]::Matches($portfolioBlock, "\['")).Count -eq 13) 'portfolio fields = 13'
Assert-Check ($html -match 'css/tokens.css' -and $html -match 'css/ucan-components.css' -and $html -match 'css/lesson04.css') 'stylesheet links'
Assert-Check ($html -match 'js/lesson04-config.js' -and $html -match 'js/lesson04.js' -and $html -match 'js/ucan-compat-runtime.js') 'script links'
Assert-Check ((Get-Content -Raw (Join-Path $root 'css\style.css')) -match '--content: 1240px') '1240px shell'
Assert-Check ($html -match 'id="section-navigation"') 'section navigation host'
Assert-Check (-not ($html -match '\son\w+\s*=')) 'no inline handlers'
$ids = [regex]::Matches($html, '\sid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
Assert-Check (($ids | Group-Object | Where-Object Count -gt 1).Count -eq 0) 'no duplicate ids'
$domReferences = [regex]::Matches($js, "document\.getElementById\('([^']+)'\)") | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
Assert-Check (($domReferences | Where-Object { $_ -notin $ids }).Count -eq 0) 'static DOM references exist'
Assert-Check (-not (Test-Path (Join-Path $root 'js\script.js'))) 'legacy js/script.js absent'
Assert-Check ($html -notmatch 'js/script\.js') 'legacy js/script.js not linked'

$p08 = [regex]::Match($html, '(?s)<section[^>]+data-page-role="practice".*?</section>\s*<section[^>]+data-page-role="support"').Value
$p09 = [regex]::Match($html, '(?s)<section[^>]+data-page-role="support".*?</section>\s*<section[^>]+data-page-role="assessment"').Value
Assert-Check (([regex]::Matches($p08, 'data-approved-prompt="L04-AI-P0[12]"')).Count -eq 2 -and $p08 -match 'data-approved-prompt="L04-AI-P01"' -and $p08 -match 'data-approved-prompt="L04-AI-P02"') 'P08 contains P01 and P02 only'
Assert-Check ($p09 -match 'id="preview-ai-prompt"' -and $p09 -notmatch 'L04-AI-P01' -and $p09 -notmatch 'L04-AI-P02') 'P09 excludes P01 and P02'
Assert-Check ($js -match "prepareAiPrompt\('L04-AI-P03'" -and $js -match 'button\.dataset\.approvedPrompt') 'P09 contains P03 only and P08 actions use their own registry id'
Assert-Check ($html -notmatch 'name="ai-mode"' -and $js -notmatch 'ai-mode') 'obsolete selector absent'
Assert-Check ($html -notmatch '(?i)\bhelp\b|\breview\b' -and $js -notmatch '(?i)\bhelp\b|\breview\b') 'generic help and review absent'
Assert-Check ($js -match 'window\.UCAN_L04_APPROVED_PROMPTS\?\.\[promptId\]' -and $js -notmatch 'modeInstructions') 'approved registry is the only prompt builder source'
Assert-Check ($js -match 'assessmentPassed\s*&&\s*isPortfolioComplete\(\)' -and $js -match 'function isPortfolioComplete\(\)') 'combined completion gate checks assessment and portfolio'
Assert-Check ($js -match 'field\.value\.trim\(\)') 'portfolio completeness trims field values'
Assert-Check ($js -match 'function savePortfolio\(\)[\s\S]*?updateNavigation\(\)' -and $js -match 'function clearPortfolio\(\)[\s\S]*?updateNavigation\(\)') 'portfolio changes refresh the completion gate'
Assert-Check ($js -match 'function showPage\(index[\s\S]*?isCompletionPage\(index\)\s*&&\s*!\(assessmentPassed\s*&&\s*isPortfolioComplete\(\)\)') 'restored completion page is safely guarded'
$resetBlock = [regex]::Match($js, 'function resetLearningProgress\(\)[\s\S]*?\n  \}').Value
Assert-Check ($resetBlock -match 'keys\.assessment' -and $resetBlock -match 'assessmentPassed\s*=\s*false' -and $resetBlock -notmatch 'keys\.portfolio') 'reset progress preserves portfolio data'
Assert-Check ($js -match 'function clearPortfolio\(\)[\s\S]*?storageRemove\(keys\.portfolio\)') 'delete portfolio follows its existing storage contract'

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
& node --check (Join-Path $root 'js\lesson04-config.js'); & node --check (Join-Path $root 'js\lesson04.js'); & node --check (Join-Path $root 'js\ucan-compat-runtime.js')
"STATIC_CHECKS_PASS"
