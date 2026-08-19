import os
from app.config import settings
from app.models.schemas import AnalysisResult

async def generate_report(analysis: AnalysisResult) -> str:
    os.makedirs(settings.REPORTS_DIR, exist_ok=True)
    report_path = os.path.join(settings.REPORTS_DIR, f"{analysis.id}.html")
    
    explanation_html = ""
    if analysis.explanation:
        findings_html = "".join([f"<li style='margin-bottom: 6px;'>{f}</li>" for f in analysis.explanation.keyFindings])
        explanation_html = f"""
        <div class="section">
            <h2>AI Forensic Explanation</h2>
            <p><strong>Summary:</strong> {analysis.explanation.summary}</p>
            <p><strong>Risk Level:</strong> <span class="badge">{analysis.explanation.riskLevel}</span></p>
            <p><strong>Recommendation:</strong> {analysis.explanation.recommendation}</p>
            <h3 style="font-size: 14px; margin-top: 15px; color: #E8D3A8; text-transform: uppercase;">Key Observations:</h3>
            <ul style="padding-left: 20px; color: #FAF6EE;">{findings_html}</ul>
        </div>
        """
        
    indicators_html = "".join([
        f"<div class='indicator-row'><span>{ind.name}</span><strong>{ind.score}%</strong></div>" 
        for ind in analysis.indicators
    ])

    verdict_color = "#E8D3A8" if analysis.verdict == "AI_GENERATED" else ("#F3E7CE" if analysis.verdict == "LIKELY_AUTHENTIC" else "#C8A96B")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CraftVerse AI Forensic Report - {analysis.originalFilename}</title>
    <style>
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #080808;
            color: #FAF6EE;
        }}
        .header {{
            border-bottom: 1px solid rgba(232, 211, 168, 0.2);
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        h1 {{
            color: #FAF6EE;
            font-size: 24px;
            margin: 0;
            letter-spacing: -0.5px;
        }}
        .tagline {{
            color: #E8D3A8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
        }}
        .section {{
            background: rgba(20, 20, 20, 0.85);
            border: 1px solid rgba(232, 211, 168, 0.15);
            padding: 24px;
            margin-bottom: 24px;
            border-radius: 12px;
        }}
        h2 {{
            color: #E8D3A8;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 0;
            margin-bottom: 16px;
            border-bottom: 1px solid rgba(232, 211, 168, 0.1);
            padding-bottom: 8px;
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }}
        .verdict-box {{
            background: #0D0D0D;
            border: 1px solid {verdict_color};
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 20px;
        }}
        .verdict-title {{
            font-size: 22px;
            font-weight: 800;
            color: {verdict_color};
            margin: 0;
        }}
        .score-large {{
            font-size: 42px;
            font-weight: 900;
            color: #FAF6EE;
            margin: 8px 0;
        }}
        .indicator-row {{
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 14px;
        }}
        .badge {{
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            background: rgba(232, 211, 168, 0.15);
            color: #E8D3A8;
            border: 1px solid rgba(232, 211, 168, 0.3);
        }}
        .footer {{
            margin-top: 40px;
            font-size: 11px;
            color: #A8A298;
            text-align: center;
            border-top: 1px solid rgba(232, 211, 168, 0.1);
            padding-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>CraftVerse AI Forensic Report</h1>
            <div class="tagline">Official Digital Authenticity Assessment</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #A8A298;">
            <div>ID: {analysis.id[:16]}...</div>
            <div>{analysis.createdAt}</div>
        </div>
    </div>
    
    <div class="verdict-box">
        <div class="verdict-title">{analysis.verdict}</div>
        <div class="score-large">{analysis.aiProbability}% AI Likelihood</div>
        <span class="badge">{analysis.confidence.upper()} CONFIDENCE</span>
    </div>
    
    <div class="section">
        <h2>Target Metadata</h2>
        <div class="grid">
            <div><strong style="color: #A8A298;">Filename:</strong> {analysis.originalFilename}</div>
            <div><strong style="color: #A8A298;">Media Type:</strong> {analysis.mediaType} ({analysis.mimeType})</div>
            <div><strong style="color: #A8A298;">Payload Size:</strong> {analysis.fileSize} bytes</div>
            <div><strong style="color: #A8A298;">Inspection Status:</strong> {analysis.status.upper()}</div>
        </div>
    </div>
    
    {explanation_html}
    
    <div class="section">
        <h2>Detection Signals</h2>
        <div>
            {indicators_html or "<div class='indicator-row'>No specific indicators recorded</div>"}
        </div>
    </div>
    
    <div class="footer">
        <p>This report provides an algorithmic assessment based on multi-model neural pattern analysis. Results are probabilistic and should be verified when absolute authenticity is critical.</p>
        <p>&copy; CraftVerse AI Security Systems. All rights reserved.</p>
    </div>
</body>
</html>"""
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    return report_path
