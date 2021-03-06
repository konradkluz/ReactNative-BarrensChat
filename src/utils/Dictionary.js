import I18n from 'react-native-i18n';
import ROOM_TYPES from './../actions/initizalizer/ROOM_TYPE';

I18n.fallbacks = true;

I18n.translations = {
    en: {
        logout: 'Logout',
        or: 'Or...',
        email: 'email',
        password: 'password',
        register: 'Register',
        notifications: 'Notifications',
        profile: 'Profile',
        user: 'User',
        new_message: 'sent you a message',
        picture_sent: 'Picture sent.',
        chats_in_location: 'Chats in your location',
        create_chat: 'Create new chat',
        type_message: 'Type a message',
        select_photo: 'Select a photo',
        cancel: 'Cancel',
        yes: 'Yes',
        no: 'No',
        exit: 'Do you want to leave app?',
        take_photo: 'Use camera',
        choose_photo_from_library: 'Choose from library',
        active_users: 'Active users',
        load_earlier: 'Load earlier messages',
        invite_user: 'Invite to friends',
        remove_friend: 'Remove friend',
        are_you_sure_to_remove_friend: 'Are you sure?',
        removed_from_friends: 'You were removed from friends',
        new_friend_invitation: 'New friend invitation',
        chats: 'Chat List',
        map: 'Chat Map',
        friends: 'Friends',
        network_error: 'Problem with internet connection',
        failed_to_log_fb: 'Failed to log in with Facebook',
        failed_to_log_google: 'Failed to log in with Google',
        invitation: 'Invitation',
        approve: 'Approve',
        decline: 'Decline',
        pending_approvals: 'Pending invitations',
        sent_invitations: 'Sent invitations',
        user_already_friend: 'This user is already your friend',
        approve_or_decline: 'Approve or decline invitation',
        invitation_not_approved_yet: 'Your invitation is not approved yet',
        no_rooms_in_distance: "No rooms in your location. Maybe create one?!",
        no_friends: "No friends invited yet.",
        required_field_error: 'Required',
        write_message: 'Write a message',
        enter_chat_title: 'Enter here chat title...',
        create: 'Create',
        [ROOM_TYPES.VERYSMALL.roomType]: 'Very Small',
        [ROOM_TYPES.SMALL.roomType]: 'Small',
        [ROOM_TYPES.MEDIUM.roomType]: 'Medium',
        [ROOM_TYPES.LARGE.roomType]: 'Large',
        [ROOM_TYPES.VERYLARGE.roomType]: 'Very Large',
        you: 'You',
        you_can_start_chat: 'You can start chat with your friend',
        new_room_in_distance_notif: 'New chat in distance',
        welcome_back_in_room_notif: "Chat to wich you are subscribed in distance",
        map_title: 'Map of nearby rooms',
        left_room_distance_while_in_room: 'You left chat distance, go back if you want continue to chat!',
        chat_title_error: 'Name used already in distance',
        check_updates: 'Check for updates',
        create_room_time_error: 'You can create chat only once in 10 minutes',
        all_notifications_settings: 'All notifications',
        particular_notification_type: 'Particular notification type',
        public_room_message: 'Public room message',
        private_message: 'Friend message',
        new_chat_in_distance: 'New chat in distance',
        no_internet_connection: 'No internet connection',
        bg_geo_setting: 'GPS when app is not active',
        leave: 'Leave'

    },
    pl: {
        logout: 'Wyloguj',
        or: 'Lub...',
        email: 'email',
        password: 'hasło',
        register: 'Stwórz konto',
        notifications: 'Notyfikacje',
        profile: 'Profil',
        user: 'Użytkownik',
        new_message: 'wysłał ci wiadomość.',
        picture_sent: 'Wysłano zdjęcie.',
        chats_in_location: 'Chaty w twojej okolicy',
        create_chat: 'Stwórz nowy chat',
        type_message: 'Wypisz wiadomość',
        select_photo: 'Wyślij zdjęcie',
        cancel: 'Anuluj',
        yes: 'Tak',
        no: 'Nie',
        exit: 'Czy chcesz opuścić applikację?',
        take_photo: 'Zrób zdjęcie',
        choose_photo_from_library: 'Wybierz z galerii',
        active_users: 'Aktywni użytkownicy',
        load_earlier: "Poprzednie wiadomości",
        invite_user: 'Zaproś użytkownika',
        remove_friend: 'Usuń znajomego',
        are_you_sure_to_remove_friend: 'Czy jesteś pewien?',
        removed_from_friends: 'Zostałeś usunięty z listy znajomych.',
        new_friend_invitation: 'Nowe zaproszenie do znajomych',
        chats: 'Czaty',
        map: 'Mapa Czatów',
        friends: 'Znajomi',
        network_error: 'Problem z połączeniem z Internetem',
        failed_to_log_fb: 'Wystąpił bląd przy logowaniu za pomocą Facebooka',
        failed_to_log_google: 'Wystąpił błąd przy logowaniu za pomocą Google',
        invitation: 'Zaproszenie',
        approve: 'Zatwierdź',
        decline: 'Odrzuć',
        pending_approvals: 'Zaproszenia do znajomych',
        sent_invitations: 'Wysłane zaproszenia',
        user_already_friend: 'Dodany do znajomych',
        approve_or_decline: 'Potwierdź lub odrzuć zaproszenie',
        invitation_not_approved_yet: 'Zaproszenie nie zostało jeszcze potwierdzone',
        no_rooms_in_distance: "Niestety w twojej okolicy nie ma czatów. Może stwórz własny?",
        no_friends: "Nie masz jeszcze żadnych znajomych.",
        required_field_error: 'Wymagane',
        write_message: 'Napisz wiadomość',
        enter_chat_title: 'Wprowadź nazwę chatu...',
        create: 'Stwórz',
        [ROOM_TYPES.VERYSMALL.roomType]: 'Bardzo mały',
        [ROOM_TYPES.SMALL.roomType]: 'Mały',
        [ROOM_TYPES.MEDIUM.roomType]: 'Średni',
        [ROOM_TYPES.LARGE.roomType]: 'Duży',
        [ROOM_TYPES.VERYLARGE.roomType]: 'Bardzo duży',
        you: 'Ty',
        you_can_start_chat: 'Możesz zacząć rozmową ze znajomym',
        new_room_in_distance_notif: 'Nowy pokój w zasięgu',
        welcome_back_in_room_notif: "Pokój do którego jesteś zapisany w zasięgu",
        map_title: 'Mapa pokojów',
        left_room_distance_while_in_room: 'Wyszedłeś poza zasięg pokoju, wróć z powrotem jeśli chcesz kontynuować czatowanie!',
        chat_title_error: 'Nazwa czatu wyrzkostana w okolicy',
        check_updates: 'Sprawdź aktualizacje',
        create_room_time_error: 'Możesz stworzyć nowy czat tylko raz na 10 minut',
        all_notifications_settings: 'Wszystkie notyfikacje',
        particular_notification_type: 'Konkretny typ notyfikacji',
        public_room_message: 'Wiadomość z chatu publicznego',
        private_message: 'Wiadomość od przyjaciela',
        new_chat_in_distance: 'Nowy czat w zasięgu',
        no_internet_connection: "Brak połączenia z internetem",
        bg_geo_setting: 'GPS w tle',
        leave: 'Opuść'
    }
};

export default I18n;