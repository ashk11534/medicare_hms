{
    'version': '18.0.1.1.0',
    'author': 'Md. Ashikuzzaman',
    'name': 'MediCare HMS',
    'description': '''MediCare Hospital Management System''',
    'summary': '''MediCare Hospital Management System''',
    'depends': [],
    'data': [
        'security/groups.xml',
        'security/ir.model.access.csv',
        'security/security.xml',
        'views/patient_views.xml',
        'menus/menus.xml',
        'views/dashboard_views.xml',
        'menus/dashboard_menus.xml'
    ],
    'assets': {
        'web.assets_backend': [
            'medicare_hms/static/src/js/hospital_dashboard.esm.js',
            'medicare_hms/static/src/xml/hospital_dashboard.xml',
        ]
    },
    'application': True,
    'installable': True
}
