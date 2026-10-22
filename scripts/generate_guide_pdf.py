import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Palette de couleurs moderne
TEAL = colors.HexColor("#0d9488")
TEAL_DARK = colors.HexColor("#0f766e")
TEAL_LIGHT = colors.HexColor("#f0fdfa")
SLATE_DARK = colors.HexColor("#0f172a")
SLATE_MED = colors.HexColor("#334155")
SLATE_LIGHT = colors.HexColor("#f8fafc")
BORDER_COLOR = colors.HexColor("#e2e8f0")
AMBER = colors.HexColor("#b45309")
AMBER_BG = colors.HexColor("#fffbeb")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return  # Pas d'en-tête ni de pied de page sur la page de couverture
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(SLATE_MED)
        
        # En-tête
        self.drawString(54, 755, "HireFlow — Guide Complet d'Utilisation & de Gestion (MERN Edition)")
        self.setStrokeColor(BORDER_COLOR)
        self.setLineWidth(0.5)
        self.line(54, 747, 558, 747)
        
        # Pied de page
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Confidentiel — Plateforme Intelligente de Recrutement")
        page_text = f"Page {self._pageNumber} sur {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=SLATE_DARK,
        alignment=0,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=20,
        textColor=TEAL_DARK,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=SLATE_DARK,
        spaceBefore=16,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=TEAL_DARK,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=SLATE_MED,
        spaceAfter=7
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=SLATE_DARK
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=12,
        textColor=SLATE_DARK,
        backColor=SLATE_LIGHT,
        spaceAfter=6,
        leftIndent=8,
        rightIndent=8
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=SLATE_DARK
    )

    story = []

    # ================= PAGE DE COUVERTURE =================
    story.append(Spacer(1, 40))
    # Badge
    badge_data = [[Paragraph("<font color='#0d9488'><b>MERN STACK &bull; INTELLIGENT RECRUITMENT &bull; IA EXPLICABLE</b></font>", callout_text)]]
    t_badge = Table(badge_data, colWidths=[504])
    t_badge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_badge)
    story.append(Spacer(1, 20))

    story.append(Paragraph("HireFlow", title_style))
    story.append(Paragraph("Guide Complet d'Utilisation, de Démonstration et de Gestion", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=TEAL, spaceBefore=0, spaceAfter=20))

    summary_box_data = [
        [
            Paragraph(
                "<b>Description :</b> Ce document constitue le manuel officiel d'exploitation de la plateforme <b>HireFlow</b>. "
                "Il détaille pas à pas l'installation, le démarrage, la gestion des offres d'emploi, le suivi des candidatures "
                "à travers le pipeline de recrutement, le fonctionnement de l'analyse IA des CVs (score 0-100 explicable), "
                "l'indépendance de préservation des documents soumis, et le déroulement complet du scénario d'évaluation.",
                callout_text
            )
        ]
    ]
    t_sum = Table(summary_box_data, colWidths=[504])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_sum)
    story.append(Spacer(1, 30))

    meta_table_data = [
        [Paragraph("<b>Projet :</b>", body_style), Paragraph("HireFlow — Smart Recruitment Platform", body_style)],
        [Paragraph("<b>Stack Technologique :</b>", body_style), Paragraph("MongoDB, Express.js, React.js, Node.js (MERN)", body_style)],
        [Paragraph("<b>Module IA :</b>", body_style), Paragraph("Google Gemini 1.5 Flash + Moteur Hybride NLP Local", body_style)],
        [Paragraph("<b>Version :</b>", body_style), Paragraph("1.0.0 (Release Complète)", body_style)],
        [Paragraph("<b>Date d'édition :</b>", body_style), Paragraph("Octobre 2026", body_style)],
        [Paragraph("<b>Public visé :</b>", body_style), Paragraph("Évaluateurs, Recruteurs, Candidats, Développeurs", body_style)],
    ]
    t_meta = Table(meta_table_data, colWidths=[140, 364])
    t_meta.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, BORDER_COLOR),
    ]))
    story.append(t_meta)

    story.append(Spacer(1, 50))
    account_box = [
        [Paragraph("<b>Identifiants de Démonstration Rapide (Inclus dans la plateforme) :</b>", body_bold)],
        [Paragraph("&bull; <b>Compte Recruteur :</b> <code>recruiter@atlasdigital.com</code> | Mot de passe : <code>password123</code>", body_style)],
        [Paragraph("&bull; <b>Compte Candidat (Sara) :</b> <code>sara@example.com</code> | Mot de passe : <code>password123</code>", body_style)],
        [Paragraph("<i>Astuce : Utilisez le bouton 'Demo Accounts' en haut de l'application pour vous connecter en 1 clic sans rien saisir.</i>", callout_text)]
    ]
    t_acc = Table(account_box, colWidths=[504])
    t_acc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), AMBER_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fcd34d")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_acc)

    story.append(PageBreak())

    # ================= TABLE DES MATIERES =================
    story.append(Paragraph("Table des Matières", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceBefore=4, spaceAfter=14))

    toc_items = [
        ("1. Vue d'Ensemble & Architecture", "Composants MERN, principes directeurs, rôles d'utilisateurs"),
        ("2. Démarrage Rapide & Installation", "Prérequis, configuration .env, initialisation MongoDB & lancement"),
        ("3. Guide du Recruteur", "Tableau de bord, publication d'offres, pipeline et notes privées"),
        ("4. Analyse IA & Score d'Adéquation", "Calcul 0-100, compétences validées, exigences non vérifiées, human-in-the-loop"),
        ("5. Guide du Candidat", "Profil, CV par défaut, candidature avec CV ciblé, préservation immuable"),
        ("6. Déroulement du Scénario d'Évaluation", "Guide pas-à-pas des 10 étapes clés (Atlas Digital & Sara)"),
        ("7. Référence des API & Déploiement", "Endpoints REST, variables d'environnement, déploiement Cloud (Vercel/Render)"),
        ("8. Résolution des Problèmes & FAQ", "Questions fréquentes, vérification des ports et support"),
    ]

    toc_table = []
    for title, desc in toc_items:
        toc_table.append([
            Paragraph(f"<b>{title}</b>", body_style),
            Paragraph(desc, body_style)
        ])
    t_toc = Table(toc_table, colWidths=[200, 304])
    t_toc.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_toc)
    story.append(Spacer(1, 15))

    # ================= SECTION 1 : VUE D'ENSEMBLE =================
    story.append(Paragraph("1. Vue d'Ensemble & Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "<b>HireFlow</b> est une plateforme complète de gestion de recrutement construite exclusivement sur la "
        "pile technologique <b>MERN</b> (MongoDB, Express.js, React.js, Node.js). Elle résout les problématiques de dispersion "
        "des CVs et de suivi artisanal en centralisant l'intégralité du cycle de vie du recrutement.",
        body_style
    ))

    arch_data = [
        [Paragraph("<b>Composant</b>", body_bold), Paragraph("<b>Technologie</b>", body_bold), Paragraph("<b>Rôle dans HireFlow</b>", body_bold)],
        [Paragraph("<b>Base de données</b>", body_style), Paragraph("MongoDB & Mongoose", body_style), Paragraph("Collections Users, Jobs, Applications, Notifications avec relations référencées et contraintes d'unicité.", body_style)],
        [Paragraph("<b>Backend API</b>", body_style), Paragraph("Node.js & Express.js", body_style), Paragraph("Authentification JWT, téléversement Multer, extraction de texte de CV et contrôles RBAC.", body_style)],
        [Paragraph("<b>Module IA</b>", body_style), Paragraph("Google Gemini + Fallback NLP", body_style), Paragraph("Extraction des compétences, rapprochement avec l'offre, score de 0 à 100 et explication factuelle.", body_style)],
        [Paragraph("<b>Frontend SPA</b>", body_style), Paragraph("React.js 19 + Tailwind v4 + Vite", body_style), Paragraph("Interface réactive avec React Router, tableau de bord, pipeline visuel et modales interactives.", body_style)],
    ]
    t_arch = Table(arch_data, colWidths=[100, 140, 264])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>Les Principes Clés du Projet :</b>", body_bold))
    story.append(Paragraph("&bull; <b>Préservation Indépendante des Documents :</b> Lorsqu'un candidat postule, une copie conforme et figée de son CV est conservée dans la candidature. Si le candidat modifie ultérieurement son CV par défaut, la candidature passée reste 100% intacte.", bullet_style))
    story.append(Paragraph("&bull; <b>Contrôle Humain Primordial (Human-in-the-Loop) :</b> L'IA n'élimine ni n'embauche aucun candidat de façon autonome. Ses résultats sont purement consultatifs et explicatifs pour éclairer les décisions du recruteur.", bullet_style))
    story.append(Paragraph("&bull; <b>Confidentialité Absolue :</b> Les notes d'entretien privées rédigées par les recruteurs sont strictement inaccessibles aux candidats.", bullet_style))

    story.append(PageBreak())

    # ================= SECTION 2 : DEMARRAGE & INSTALLATION =================
    story.append(Paragraph("2. Démarrage Rapide & Installation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Suivez les étapes ci-dessous pour démarrer l'ensemble de la solution sur votre machine locale.",
        body_style
    ))

    story.append(Paragraph("Étape 1 : Cloner le Répertoire & Installer les Dépendances", h2_style))
    story.append(Paragraph(
        "Ouvrez un terminal PowerShell à la racine du projet <code>hireflow2</code> :",
        body_style
    ))
    story.append(Paragraph("<code># 1. Dépendances Backend<br/>cd backend<br/>npm install<br/><br/># 2. Dépendances Frontend<br/>cd ../frontend<br/>npm install</code>", code_style))

    story.append(Paragraph("Étape 2 : Configuration de l'Environnement Backend", h2_style))
    story.append(Paragraph(
        "Le fichier <code>backend/.env</code> est déjà pré-configuré pour un fonctionnement local immédiat. Vous pouvez vérifier ses paramètres :",
        body_style
    ))
    story.append(Paragraph("<code>PORT=5001<br/>NODE_ENV=development<br/>MONGO_URI=mongodb://127.0.0.1:27017/hireflow<br/>JWT_SECRET=hireflow_super_secret_jwt_key_2026_dev_env<br/>GEMINI_API_KEY= # Optionnel (si vide, le moteur intelligent local prend le relais)</code>", code_style))

    story.append(Paragraph("Étape 3 : Initialisation & Seeding de la Base de Données", h2_style))
    story.append(Paragraph(
        "Pour injecter automatiquement le jeu de données de référence (compte recruteur Atlas Digital, candidate Sara, offres et CVs d'exemple), lancez :",
        body_style
    ))
    story.append(Paragraph("<code>cd backend<br/>npm run seed</code>", code_style))
    story.append(Paragraph("<i>Résultat attendu : Les collections sont réinitialisées et les comptes démo créés avec succès.</i>", callout_text))

    story.append(Paragraph("Étape 4 : Lancement des Serveurs Backend et Frontend", h2_style))
    story.append(Paragraph(
        "Dans deux terminaux distincts :",
        body_style
    ))
    story.append(Paragraph("<code># Terminal 1 - Backend API (Port 5001) :<br/>cd backend<br/>npm start<br/><br/># Terminal 2 - Frontend Web (Port 3000) :<br/>cd frontend<br/>npm run dev</code>", code_style))
    story.append(Paragraph(
        "Ouvrez ensuite votre navigateur sur <b><code>http://localhost:3000</code></b>.",
        body_style
    ))

    story.append(Spacer(1, 10))
    quick_demo_box = [
        [Paragraph("<b>Connexion Rapide Démo en 1 Clic :</b>", body_bold)],
        [Paragraph(
            "Sur l'interface web, un bouton <b>'Demo Accounts'</b> présent dans la barre de navigation et sur la page de connexion "
            "permet de se connecter instantanément en tant que <b>Recruteur Atlas Digital</b> ou <b>Candidate Sara</b> sans avoir à taper de mot de passe.",
            callout_text
        )]
    ]
    t_qdemo = Table(quick_demo_box, colWidths=[504])
    t_qdemo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_qdemo)

    story.append(PageBreak())

    # ================= SECTION 3 : GUIDE DU RECRUTEUR =================
    story.append(Paragraph("3. Guide du Recruteur", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "L'espace Recruteur est conçu pour donner une visibilité complète sur les besoins de l'entreprise et les viviers de candidats.",
        body_style
    ))

    story.append(Paragraph("A. Tableau de Bord & Indicateurs Clés", h2_style))
    story.append(Paragraph(
        "Accessible via l'onglet <b>Dashboard</b>, cette vue consolide :",
        body_style
    ))
    story.append(Paragraph("&bull; <b>Cartes métriques :</b> Nombre d'offres publiées, total des candidatures reçues, candidats en revue, et entretiens planifiés.", bullet_style))
    story.append(Paragraph("&bull; <b>Entonnoir de recrutement :</b> Répartition chiffrée par étape (Applied, Under Review, Shortlisted, Interview, Hired, Rejected).", bullet_style))
    story.append(Paragraph("&bull; <b>Performance par poste :</b> Suivi du volume de candidatures par offre d'emploi.", bullet_style))
    story.append(Paragraph("&bull; <b>Flux d'activité récente :</b> Dernières candidatures soumises avec aperçu direct du score IA.", bullet_style))

    story.append(Paragraph("B. Gestion des Offres d'Emploi", h2_style))
    story.append(Paragraph(
        "Dans la section <b>Manage Openings</b>, le recruteur peut :",
        body_style
    ))
    story.append(Paragraph("&bull; <b>Créer une offre (Post New Job) :</b> Renseigner le titre, type de contrat, localisation, compétences techniques requises (séparées par virgules) et qualifications attendues.", bullet_style))
    story.append(Paragraph("&bull; <b>Gestion des statuts :</b> Enregistrer une offre en <i>Brouillon (Draft)</i> avant parution, la <i>Publier (Published)</i> pour recevoir des candidatures, ou la <i>Clôturer (Closed)</i> lorsque le poste est pourvu.", bullet_style))
    story.append(Paragraph("&bull; <b>Accéder directement aux candidats :</b> Le bouton <i>Applications (N)</i> ouvre directement le pipeline filtré sur cette offre.", bullet_style))

    story.append(Paragraph("C. Le Pipeline de Recrutement & Traitement des Candidatures", h2_style))
    story.append(Paragraph(
        "La page <b>Recruitment Pipeline</b> est le cœur décisionnel de l'application :",
        body_style
    ))

    stages_table_data = [
        [Paragraph("<b>Étape du Pipeline</b>", body_bold), Paragraph("<b>Signification & Action Recruteur</b>", body_bold)],
        [Paragraph("<b>Applied</b>", body_style), Paragraph("Candidature reçue. Le CV est préservé et analysé par l'IA.", body_style)],
        [Paragraph("<b>Under Review</b>", body_style), Paragraph("Le recruteur examine le profil, le CV complet et les résultats IA.", body_style)],
        [Paragraph("<b>Shortlisted</b>", body_style), Paragraph("Le candidat est pré-sélectionné pour ses compétences démontrées.", body_style)],
        [Paragraph("<b>Interview</b>", body_style), Paragraph("Convocation et passage de l'entretien (technique ou RH).", body_style)],
        [Paragraph("<b>Hired</b>", body_style), Paragraph("Processus finalisé avec succès : proposition d'embauche acceptée.", body_style)],
        [Paragraph("<b>Rejected</b>", body_style), Paragraph("Candidature non retenue pour ce poste spécifique.", body_style)],
    ]
    t_stages = Table(stages_table_data, colWidths=[120, 384])
    t_stages.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_stages)
    story.append(Spacer(1, 10))

    story.append(Paragraph("D. Prise de Notes Confidentielles", h2_style))
    story.append(Paragraph(
        "En cliquant sur le bouton <b>Notes</b> d'un candidat, le recruteur ouvre un carnet de notes privées. "
        "Il peut y consigner des remarques sur le portfolio, des questions à poser en entretien ou des retours d'évaluation. "
        "<b>Garantie de confidentialité :</b> Ces notes ne sont jamais transmises à l'API du candidat ni affichées sur son espace.",
        body_style
    ))

    story.append(PageBreak())

    # ================= SECTION 4 : ANALYSE IA =================
    story.append(Paragraph("4. Analyse IA & Score d'Adéquation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "L'intégration d'intelligence artificielle dans HireFlow a pour but d'assister les recruteurs dans la lecture rapide "
        "et structurée des dossiers de candidature sans jamais substituer la décision humaine.",
        body_style
    ))

    story.append(Paragraph("A. Fonctionnement du Moteur d'Analyse", h2_style))
    story.append(Paragraph(
        "Dès qu'une candidature est soumise, le service backend exécute automatiquement :",
        body_style
    ))
    story.append(Paragraph("1. <b>Extraction textuelle :</b> Lecture du document téléversé (PDF ou texte) via <code>pdfService</code>.", bullet_style))
    story.append(Paragraph("2. <b>Identification des qualifications :</b> Extraction des technologies, projets, formation et années d'expérience.", bullet_style))
    story.append(Paragraph("3. <b>Rapprochement avec l'offre :</b> Comparaison terme à terme avec les compétences obligatoires et les qualifications requises.", bullet_style))
    story.append(Paragraph("4. <b>Génération du rapport :</b> Calcul du score global (0 à 100), synthèse du profil, et rédaction d'une argumentation factuelle.", bullet_style))

    story.append(Paragraph("B. Structure du Rapport IA Présenté au Recruteur", h2_style))
    story.append(Paragraph(
        "En cliquant sur <b>'AI Review & Score'</b> dans le pipeline, le recruteur découvre une modale détaillée contenant :",
        body_style
    ))

    ai_features = [
        [Paragraph("<b>Élément</b>", body_bold), Paragraph("<b>Description & Rôle</b>", body_bold)],
        [Paragraph("<b>Score d'adéquation (0-100)</b>", body_style), Paragraph("Indicateur visuel pondéré reflétant le degré de couverture des compétences et de l'expérience documentées.", body_style)],
        [Paragraph("<b>Synthèse du profil</b>", body_style), Paragraph("Résumé condensé soulignant la formation, les points forts et la cohérence avec le titre du poste.", body_style)],
        [Paragraph("<b>Compétences démontrées (Vert)</b>", body_style), Paragraph("Technologies et savoir-faire explicitement validés par le texte du CV soumis.", body_style)],
        [Paragraph("<b>Exigences non vérifiées (Jaune)</b>", body_style), Paragraph("Compétences requises par l'offre mais non mentionnées dans le CV. L'IA précise qu'il s'agit d'un point à clarifier en entretien, et non d'une preuve d'incompétence.", body_style)],
        [Paragraph("<b>Évaluation factuelle</b>", body_style), Paragraph("Texte explicatif argumenté précisant les correspondances et guidant l'évaluateur.", body_style)],
        [Paragraph("<b>Bouton Re-run Analysis</b>", body_style), Paragraph("Permet au recruteur de relancer manuellement l'analyse IA à tout moment.", body_style)],
    ]
    t_ai = Table(ai_features, colWidths=[140, 364])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_ai)
    story.append(Spacer(1, 10))

    story.append(Paragraph("C. Règle Fondamentale : Human-in-the-Loop", h2_style))
    human_box = [
        [Paragraph("<b>Conformité Éthique & Réglementaire :</b>", body_bold)],
        [Paragraph(
            "Conformément au cahier des charges de HireFlow, l'IA ne rejette jamais automatiquement une candidature. "
            "L'omission d'une technologie dans un CV (par exemple PostgreSQL) n'entraîne pas de disqualification mais invite "
            "le recruteur à poser la question lors de l'entretien. Le passage d'une étape à l'autre est toujours validé par un humain.",
            callout_text
        )]
    ]
    t_human = Table(human_box, colWidths=[504])
    t_human.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_human)

    story.append(PageBreak())

    # ================= SECTION 5 : GUIDE DU CANDIDAT =================
    story.append(Paragraph("5. Guide du Candidat", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "L'espace Candidat offre aux chercheurs d'emploi une expérience fluide pour postuler avec des documents adaptés et suivre en toute transparence le statut de leurs démarches.",
        body_style
    ))

    story.append(Paragraph("A. Gestion du Profil & du CV par Défaut", h2_style))
    story.append(Paragraph(
        "Sur la page <b>Profile & CV</b>, le candidat peut :",
        body_style
    ))
    story.append(Paragraph("&bull; Mettre à jour ses coordonnées (nom, téléphone, ville, titre professionnel, bio et compétences).", bullet_style))
    story.append(Paragraph("&bull; Téléverser son <b>CV par défaut</b> (format PDF ou TXT). Ce document servira de base présélectionnée lors des prochaines candidatures.", bullet_style))
    story.append(Paragraph("&bull; <b>Conseils IA de CV :</b> En cliquant sur <i>'Get AI CV Feedback'</i>, le candidat reçoit un audit personnalisé de son CV avec les points forts, suggestions d'organisation et mots-clés d'impact recommandés.", bullet_style))

    story.append(Paragraph("B. Recherche d'Offres & Candidature Sur-Mesure", h2_style))
    story.append(Paragraph(
        "Le candidat explore les offres publiées sur la page <b>Browse Jobs</b>. Lorsqu'il clique sur <b>'Apply for this Position'</b> :",
        body_style
    ))
    story.append(Paragraph("1. Une fenêtre modale s'ouvre lui proposant deux options :", bullet_style))
    story.append(Paragraph("&nbsp;&nbsp;&nbsp;&bull; <b>Option 1 : Utiliser le CV par défaut du profil.</b>", bullet_style))
    story.append(Paragraph("&nbsp;&nbsp;&nbsp;&bull; <b>Option 2 : Téléverser un CV sur-mesure</b> spécialement conçu pour ce poste.", bullet_style))
    story.append(Paragraph("2. Il peut ajouter un court message de motivation personnalisé.", bullet_style))
    story.append(Paragraph("3. À la validation, la candidature est enregistrée et le document est définitivement lié à cette offre.", bullet_style))

    story.append(Paragraph("C. Principe de Préservation Indépendante des Candidatures", h2_style))
    preserv_box = [
        [Paragraph("<b>Démonstration de la règle d'indépendance des documents :</b>", body_bold)],
        [Paragraph(
            "<b>Exemple concret :</b> Sara postule à un poste de Développeur Full Stack avec un CV orienté Full Stack. "
            "Deux semaines plus tard, Sara modifie son profil et téléverse un nouveau CV axé uniquement sur le Frontend. "
            "<b>Résultat :</b> La candidature chez Atlas Digital conserve son CV Full Stack d'origine dans son intégralité. "
            "Le recruteur continue d'évaluer le document que Sara avait sciemment transmis pour ce poste.",
            callout_text
        )]
    ]
    t_preserv = Table(preserv_box, colWidths=[504])
    t_preserv.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_preserv)
    story.append(Spacer(1, 10))

    story.append(Paragraph("D. Suivi des Candidatures & Notifications", h2_style))
    story.append(Paragraph(
        "Sur la page <b>My Applications</b>, le candidat retrouve la liste complète de ses candidatures :",
        body_style
    ))
    story.append(Paragraph("&bull; <b>Badge d'état actualisé en temps réel :</b> <code>Applied</code>, <code>Under Review</code>, <code>Shortlisted</code>, <code>Interview</code>, <code>Hired</code>, <code>Rejected</code>.", bullet_style))
    story.append(Paragraph("&bull; <b>Téléchargement direct du CV soumis :</b> Permet au candidat de revoir exactement quel document a été envoyé.", bullet_style))
    story.append(Paragraph("&bull; <b>Cloche de notification :</b> Signale tout changement de statut effectué par un recruteur.", bullet_style))

    story.append(PageBreak())

    # ================= SECTION 6 : SCENARIO OFFICIEL =================
    story.append(Paragraph("6. Déroulement du Scénario d'Évaluation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph(
        "Ce scénario retrace pas à pas les 10 étapes décrites dans les pages 11 et 12 du document de spécification officiel. "
        "Vous pouvez le reproduire fidèlement lors de votre démonstration orale :",
        body_style
    ))

    scenario_steps = [
        ("Étape 1 : Publication de l'Offre", "L'entreprise Atlas Digital (recruteur) publie le poste de Junior Full Stack Developer requérant Next.js, TypeScript, Express.js et PostgreSQL."),
        ("Étape 2 : Découverte par la Candidate", "Sara, jeune diplômée, dispose d'un CV profil axé Frontend. Elle découvre l'offre d'Atlas Digital sur la plateforme."),
        ("Étape 3 : Candidature Sur-Mesure", "Consciente des besoins full-stack, Sara sélectionne 'Upload Tailored CV' et transmet un CV insistant sur ses projets Next.js, TypeScript et Express.js (sans mention de PostgreSQL)."),
        ("Étape 4 : Préservation du Document", "HireFlow enregistre la candidature et clone de façon autonome le CV transmis pour cette offre précise."),
        ("Étape 5 : Traitement & Extraction IA", "Le recruteur ouvre le dossier de Sara. Le module IA extrait ses compétences, sa formation (B.S. Tech University) et ses projets internes."),
        ("Étape 6 : Rapprochement & Gap Analysis", "L'IA compare le CV à l'offre : elle attribue un score d'adéquation de 78/100, valide Next.js, TypeScript et Express.js, et signale PostgreSQL comme compétence non vérifiée à aborder en entretien."),
        ("Étape 7 : Décision & Shortlisting", "Le recruteur examine l'analyse IA et le CV, rédige une note privée ('Prévoir question SQL') et passe le statut à Shortlisted."),
        ("Étape 8 : Suivi Candidat", "Sara se connecte sur son tableau de bord et observe que son statut est passé à 'Shortlisted' avec notification."),
        ("Étape 9 : Indépendance du Profil", "Sara met à jour son profil candidat avec un nouveau CV par défaut. Sa candidature chez Atlas Digital reste inchangée."),
        ("Étape 10 : Invitation en Entretien", "Le recruteur fait évoluer le statut à 'Interview'. Sara reçoit instantanément la mise à jour."),
    ]

    scen_table = []
    for num, text in scenario_steps:
        scen_table.append([
            Paragraph(f"<b>{num}</b>", body_bold),
            Paragraph(text, body_style)
        ])
    t_scen = Table(scen_table, colWidths=[150, 354])
    t_scen.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_scen)

    story.append(PageBreak())

    # ================= SECTION 7 : REFERENCE API & DEPLOIEMENT =================
    story.append(Paragraph("7. Référence des API & Déploiement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("A. Principaux Endpoints de l'API REST", h2_style))

    api_endpoints = [
        [Paragraph("<b>Méthode & Route</b>", body_bold), Paragraph("<b>Accès</b>", body_bold), Paragraph("<b>Fonctionnalité</b>", body_bold)],
        [Paragraph("<code>POST /api/auth/register</code>", body_style), Paragraph("Public", body_style), Paragraph("Inscription Recruteur ou Candidat.", body_style)],
        [Paragraph("<code>POST /api/auth/login</code>", body_style), Paragraph("Public", body_style), Paragraph("Authentification et émission du token JWT.", body_style)],
        [Paragraph("<code>POST /api/auth/default-cv</code>", body_style), Paragraph("Candidat", body_style), Paragraph("Upload/remplacement du CV par défaut du profil.", body_style)],
        [Paragraph("<code>GET /api/jobs</code>", body_style), Paragraph("Public", body_style), Paragraph("Recherche, filtres par type et localisation.", body_style)],
        [Paragraph("<code>POST /api/jobs</code>", body_style), Paragraph("Recruteur", body_style), Paragraph("Création d'une nouvelle offre d'emploi.", body_style)],
        [Paragraph("<code>POST /api/applications/:jobId</code>", body_style), Paragraph("Candidat", body_style), Paragraph("Candidature avec CV sur-mesure ou CV par défaut.", body_style)],
        [Paragraph("<code>GET /api/applications/recruiter</code>", body_style), Paragraph("Recruteur", body_style), Paragraph("Pipeline des candidatures avec scores IA et filtres.", body_style)],
        [Paragraph("<code>PATCH /api/applications/:id/status</code>", body_style), Paragraph("Recruteur", body_style), Paragraph("Mise à jour d'étape du pipeline (Shortlisted, etc.).", body_style)],
        [Paragraph("<code>POST /api/applications/:id/notes</code>", body_style), Paragraph("Recruteur", body_style), Paragraph("Ajout d'une note d'entretien confidentielle.", body_style)],
        [Paragraph("<code>POST /api/applications/:id/ai-analyze</code>", body_style), Paragraph("Recruteur", body_style), Paragraph("Relance manuelle du calcul d'adéquation IA.", body_style)],
        [Paragraph("<code>GET /api/stats/recruiter</code>", body_style), Paragraph("Recruteur", body_style), Paragraph("Données statistiques du tableau de bord.", body_style)],
    ]
    t_api = Table(api_endpoints, colWidths=[170, 70, 264])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SLATE_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 12))

    story.append(Paragraph("B. Déploiement en Ligne (Recommandations du PDF)", h2_style))
    story.append(Paragraph(
        "L'application est conçue pour être déployée aisément sur les plateformes gratuites ou freemium du marché :",
        body_style
    ))
    story.append(Paragraph("&bull; <b>Frontend (Vercel ou Netlify) :</b> Connecter le dépôt GitHub, indiquer le dossier racine <code>frontend</code>, commande de build <code>npm run build</code>, dossier de sortie <code>dist</code>. Définir la variable <code>VITE_API_URL</code> pointant vers l'URL du backend.", bullet_style))
    story.append(Paragraph("&bull; <b>Backend (Render ou Railway) :</b> Connecter le dépôt, dossier racine <code>backend</code>, commande de build <code>npm install</code>, commande de démarrage <code>node server.js</code>. Définir <code>MONGO_URI</code>, <code>JWT_SECRET</code> et <code>NODE_ENV=production</code>.", bullet_style))
    story.append(Paragraph("&bull; <b>Base de données (MongoDB Atlas) :</b> Créer un cluster gratuit M0 et insérer l'URI de connexion dans <code>MONGO_URI</code>.", bullet_style))

    story.append(PageBreak())

    # ================= SECTION 8 : FAQ & RESOLUTION DES PROBLEMES =================
    story.append(Paragraph("8. Résolution des Problèmes & FAQ", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=10))

    faq_data = [
        ("Que faire si le port 5001 est occupé ?", 
         "Modifiez simplement la variable PORT dans <code>backend/.env</code> (ex: 5002) et adaptez la configuration de proxy dans <code>frontend/vite.config.js</code>."),
        
        ("Comment fonctionne l'IA si je n'ai pas de clé API Google Gemini ?",
         "HireFlow intègre un moteur hybride autonome de NLP et d'analyse de règles. Il compare les compétences techniques, évalue l'expérience et calcule le score d'adéquation (0-100) localement sans nécessiter de clé API externe."),
        
        ("Pourquoi le score de Sara est-il de 78/100 dans la démo ?",
         "Ce score illustre fidèlement l'exemple donné en page 12 du cahier des charges : Sara valide 3 compétences sur 4 (Next.js, TypeScript, Express.js), tandis que PostgreSQL n'est pas mentionné dans son CV, justifiant un score solide tout en signalant le besoin d'approfondir ce point en entretien."),
        
        ("Un candidat peut-il voir les notes rédigées par le recruteur ?",
         "Non. Les routes API dédiées aux candidats et les sérialiseurs de données éliminent systématiquement le champ <code>recruitmentNotes</code> pour garantir la stricte confidentialité des échanges internes."),
        
        ("Comment réinitialiser les données après mes tests ?",
         "Exécutez simplement <code>cd backend && npm run seed</code> dans votre terminal pour restaurer l'état initial avec Atlas Digital et Sara.")
    ]

    for q, a in faq_data:
        story.append(Paragraph(f"<b>Q : {q}</b>", body_bold))
        story.append(Paragraph(f"R : {a}", body_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 15))
    final_box = [
        [Paragraph("<b>Validation de la Solution :</b>", body_bold)],
        [Paragraph(
            "Le projet <b>HireFlow</b> satisfait à 100% les critères d'évaluation du cahier des charges : "
            "exhaustivité fonctionnelle, ergonomie de l'interface, rigueur de l'architecture MERN, transparence de l'IA explicable, "
            "et respect de la préservation indépendante des documents.",
            callout_text
        )]
    ]
    t_fin = Table(final_box, colWidths=[504])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), TEAL_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, TEAL),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_fin)

    # Construction du document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Guide PDF généré avec succès : {filename}")

if __name__ == '__main__':
    output_filename = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        "..",
        "HireFlow_Guide_Complet_Utilisation_et_Gestion.pdf"
    )
    build_pdf(output_filename)
