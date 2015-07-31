var translations = {
    "nl": {
        "authorisationpopup": {
            "intro": "Om deze add-on te kunnen gebruiken moet je hem autoriseren.",
            "link": "Add-on autoriseren"
        },
        "sidebar": {
            "intro": "Voeg een evenement aan het formulier toe door de onderstaande opties in te vullen. Je kunt kiezen voor een evenement dat de hele dag duurt of voor een evenement met een start- en eindtijd.",
            "typeLabel": "Wat voor type evenement wil je toevoegen?",
            "partial": "Een evenement met een start- en eindtijd",
            "day": "Een evenement dat één of meerdere dagen duurt",
            "titleLabel": "Titel",
            "startDateLabel": "Startdatum",
            "startTimeLabel": "Starttijd",
            "endDateLabel": "Einddatum",
            "endTimeLabel": "Eindtijd",
            "locationLabel": "Locatie",
            "addButton": "Voeg toe"
        },
        "success": "Je hebt succesvol een evenement aan je formulier toegevoegd. Wanneer een respondent in het formulier aangeeft aanwezig te zijn krijgt hij of zij een uitnoding in zijn of haar agenda.",
        "error": "Je kan slechts één evenement aan je formulier toevoegen, verwijder de oude eerst om een nieuwe te kunnen toevoegen.",
        "eventString": {
            "placeOn": " vindt plaats op ",
            "placeFrom": " vindt plaats van ",
            "from": " van ",
            "till": " tot ",
            "at": " op de locatie: "
        },
        "formItem": {
            "title": "Ben je er bij?",
            "yes": "Ja",
            "no": "Nee"
        }
    },
    "en": {
        "authorisationpopup": {
            "intro": "To be able to use this add-on you need to authorise it.",
            "link": "Authorise add-on"
        },
        "sidebar": {
            "intro": "Add an event by filling out the form below. You can select whether you would like to add an all-day event or an event with a start and end time.",
            "typeLabel": "What kind of event would you like to add?",
            "partial": "An event with a start and end time",
            "day": "An event spanning one or multiple full days",
            "titleLabel": "Title",
            "startDateLabel": "Start date",
            "startTimeLabel": "Start time",
            "endDateLabel": "End date",
            "endTimeLabel": "End time",
            "locationLabel": "Location",
            "addButton": "Add event"
        },
        "success": "You've successfully added the event to your form. When the form gets submitted and the user has selected yes they will be invited for your event.",
        "error": "You can only add one event to your form, please remove the old one first.",
        "eventString": {
            "placeOn": " will take place on ",
            "placeFrom": " will take place from ",
            "from": " from ",
            "till": " till ",
            "at": " at "
        },
        "formItem": {
            "title": "Will you be there?",
            "yes": "Yes",
            "no": "No"
        }
    },
    "es": {
        "authorisationpopup": {
            "intro": "Para utilizar este plugin que necesita para autorizarlo.",
            "link": "Autorizar Plugin"
        },
        "sidebar": {
            "intro": "Añadir un evento rellenando el siguiente formulario. Tu puedes optar por un evento que dura todo el día o para un evento con una hora de inicio y fin.",
            "typeLabel": "Qué tipo de evento es lo que quieres agregar?",
            "partial": "Un evento con una hora de inicio y fin",
            "day": "Un evento que dura uno o más días",
            "titleLabel": "Título",
            "startDateLabel": "Fecha de inicio",
            "startTimeLabel": "Hora de inicio",
            "endDateLabel": "Fecha final",
            "endTimeLabel": "Hora final",
            "locationLabel": "Lugar",
            "addButton": "Añadir"
        },
        "success": "Tienes un evento añadido correctamente a su formulario. Cuando un demandado en la forma indicada para estar presente, él o ella recibe una invitación en su calendario.",
        "error": "Tu puedes agregar un solo evento a su formulario, quite el viejo primero en añadir uno nuevo.",
        "eventString": {
            "placeOn": " se lleva a cabo en ",
            "placeFrom": " tendrá lugar del ",
            "from": " desde ",
            "till": " a ",
            "at": " en el lugar: "
        },
        "formItem": {
            "title": "Estás ahí?",
            "yes": "Si",
            "no": "No"
        }
    }
};

function getEventStringTranslations(language) {
    return translations[language].eventString;
}

function addGoogleTranslations() {
    translations.es = {
        "authorisationpopup": {
            "intro": LanguageApp.translate(translations.en.authorisationpopup.intro, 'en', 'es'),
            "link": LanguageApp.translate(translations.en.authorisationpopup.link, 'en', 'es')
        },
        "sidebar": {
            "intro": LanguageApp.translate(translations.en.sidebar.intro, 'en', 'es'),
            "typeLabel": LanguageApp.translate(translations.en.sidebar.typeLabel, 'en', 'es'),
            "partial": LanguageApp.translate(translations.en.sidebar.partial, 'en', 'es'),
            "day": LanguageApp.translate(translations.en.sidebar.day, 'en', 'es'),
            "titleLabel": LanguageApp.translate(translations.en.sidebar.titleLabel, 'en', 'es'),
            "startDateLabel": LanguageApp.translate(translations.en.sidebar.startDateLabel, 'en', 'es'),
            "startTimeLabel": LanguageApp.translate(translations.en.sidebar.startTimeLabel, 'en', 'es'),
            "endDateLabel": LanguageApp.translate(translations.en.sidebar.endDateLabel, 'en', 'es'),
            "endTimeLabel": LanguageApp.translate(translations.en.sidebar.endTimeLabel, 'en', 'es'),
            "locationLabel": LanguageApp.translate(translations.en.sidebar.locationLabel, 'en', 'es'),
            "addButton": LanguageApp.translate(translations.en.sidebar.addButton, 'en', 'es')
        },
        "success": LanguageApp.translate(translations.en.success, 'en', 'es'),
        "error": LanguageApp.translate(translations.en.error, 'en', 'es'),
        "eventString": {
            "placeOn": LanguageApp.translate(translations.en.eventString.placeOn, 'en', 'es'),
            "placeFrom": LanguageApp.translate(translations.en.eventString.placeFrom, 'en', 'es'),
            "from": LanguageApp.translate(translations.en.eventString.from, 'en', 'es'),
            "till": LanguageApp.translate(translations.en.eventString.till, 'en', 'es'),
            "at": LanguageApp.translate(translations.en.eventString.at, 'en', 'es')
        },
        "formItem": {
            "title": LanguageApp.translate(translations.en.title, 'en', 'es'),
            "yes": LanguageApp.translate(translations.en.yes, 'en', 'es'),
            "no": LanguageApp.translate(translations.en.no, 'en', 'es')
        }
    };
    translations.tr = {
        "authorisationpopup": {
            "intro": LanguageApp.translate(translations.en.authorisationpopup.intro, 'en', 'tr'),
            "link": LanguageApp.translate(translations.en.authorisationpopup.link, 'en', 'tr')
        },
        "sidebar": {
            "intro": LanguageApp.translate(translations.en.sidebar.intro, 'en', 'tr'),
            "typeLabel": LanguageApp.translate(translations.en.sidebar.typeLabel, 'en', 'tr'),
            "partial": LanguageApp.translate(translations.en.sidebar.partial, 'en', 'tr'),
            "day": LanguageApp.translate(translations.en.sidebar.day, 'en', 'tr'),
            "titleLabel": LanguageApp.translate(translations.en.sidebar.titleLabel, 'en', 'tr'),
            "startDateLabel": LanguageApp.translate(translations.en.sidebar.startDateLabel, 'en', 'tr'),
            "startTimeLabel": LanguageApp.translate(translations.en.sidebar.startTimeLabel, 'en', 'tr'),
            "endDateLabel": LanguageApp.translate(translations.en.sidebar.endDateLabel, 'en', 'tr'),
            "endTimeLabel": LanguageApp.translate(translations.en.sidebar.endTimeLabel, 'en', 'tr'),
            "locationLabel": LanguageApp.translate(translations.en.sidebar.locationLabel, 'en', 'tr'),
            "addButton": LanguageApp.translate(translations.en.sidebar.addButton, 'en', 'tr')
        },
        "success": LanguageApp.translate(translations.en.success, 'en', 'tr'),
        "error": LanguageApp.translate(translations.en.error, 'en', 'tr'),
        "eventString": {
            "placeOn": LanguageApp.translate(translations.en.eventString.placeOn, 'en', 'tr'),
            "placeFrom": LanguageApp.translate(translations.en.eventString.placeFrom, 'en', 'tr'),
            "from": LanguageApp.translate(translations.en.eventString.from, 'en', 'tr'),
            "till": LanguageApp.translate(translations.en.eventString.till, 'en', 'tr'),
            "at": LanguageApp.translate(translations.en.eventString.at, 'en', 'tr')
        },
        "formItem": {
            "title": LanguageApp.translate(translations.en.title, 'en', 'tr'),
            "yes": LanguageApp.translate(translations.en.yes, 'en', 'tr'),
            "no": LanguageApp.translate(translations.en.no, 'en', 'tr')
        }
    };
}
