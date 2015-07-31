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
    },
    "tr": {
        "authorisationpopup": {
            "intro": "Bu eklentinin kullanımına izin vermeniz gerekiyor.",
            "link": "Eklentiye izin ver"
        },
        "sidebar": {
            "intro": "Yeni bir etkinlik eklemek için aşağıdaki formu doldurun. Tam gün süren ya da başlangıç ve bitiş zamanları belirlenebilen bir etkinlik ekleyebilirsiniz.",
            "typeLabel": "Ne tarz bir etkinlik eklemek istersiniz?",
            "partial": "Başlangıç ve bitiş zamanı olan bir etkinlik",
            "day": "Bir veya daha fazla gün sürecek olan bir etkinlik",
            "titleLabel": "Konu",
            "startDateLabel": "Başlangıç tarihi",
            "startTimeLabel": "Başlangıç zamanı",
            "endDateLabel": "Bitiş tarihi",
            "endTimeLabel": "Bitiş zamanı",
            "locationLabel": "Yer",
            "addButton": "Etkinlik Ekle"
        },
        "success": "Eklentiyi formunuza başarıyla eklediniz. Form onaylandığında ve kullanıcı evet seçeneğini işaretlediğinde, etkinliğinize davet edilecekler.",
        "error": "Formunuza sadece bir etkinlik ekleyebilirsiniz, lütfen öncelikle eski olanı silin.",
        "eventString": {
            "placeOn": " için belirlenen tarih ",
            "placeFrom": " için belirlenen başlangıç tarihi ",
            "from": ". ",
            "till": " ile ",
            "at": " saatleri arasında gerçekleşecek olan etkinliğin yapılacağı yer ise "
        },
        "formItem": {
            "title": "Orada olacak mısınız?",
            "yes": "Evet",
            "no": "Hayır"
        }
    }
};

function getEventStringTranslations(language) {
    return translations[language].eventString;
}
