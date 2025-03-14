document.addEventListener("DOMContentLoaded", () => {
    const contactsContainer = document.getElementById("contacts");
    const chatContactName = document.getElementById("chat-contact-name");
    const chatProfilePic = document.getElementById("chat-profile-pic");
    const lastSeen = document.getElementById("last-seen");
    const chatMessages = document.getElementById("chat-messages");
    const sendButton = document.getElementById("send-button");
    const messageInput = document.getElementById("message-input");
    const searchBox = document.getElementById("search-box");
    const addContactButton = document.querySelector(".icons span:first-child");
    const callIcon = document.querySelector("#chat-header .header-icons span:first-child");
    const callPopup = document.getElementById("call-popup");
    const popupContactName = document.getElementById("popup-contact-name");
    const popupContactPhone = document.getElementById("popup-contact-phone");
    const closePopup = document.getElementById("close-popup");

    let activeContact = null;
    let contactList = JSON.parse(localStorage.getItem("contactList")) || [];
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};

    // Call Popup Logic
    callIcon.addEventListener("click", () => {
        if (!activeContact) return;

        const contact = contactList.find(c => c.name === activeContact);
        if (!contact) return;

        popupContactName.textContent = contact.name;
        popupContactPhone.textContent = contact.phone;

        callPopup.style.display = "block";
    });

    closePopup.addEventListener("click", () => {
        callPopup.style.display = "none";
    });

    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();
        document.querySelectorAll(".contact").forEach(contact => {
            const name = contact.dataset.name.toLowerCase();
            contact.style.display = name.includes(query) ? "flex" : "none";
        });
    });
    document.addEventListener("DOMContentLoaded", function () {
        let settingsIcon = document.getElementById("settings-icon");
        let settingsMenu = document.getElementById("settings-menu");
    
        settingsIcon.addEventListener("click", function () {
            if (settingsMenu.style.display === "none" || settingsMenu.style.display === "") {
                settingsMenu.style.display = "block";
            } else {
                settingsMenu.style.display = "none";
            }
        });
    });
    function createContactElement(contact) {
        const contactDiv = document.createElement("div");
        contactDiv.classList.add("contact");
        contactDiv.dataset.name = contact.name;

        let lastMessageTime = localStorage.getItem(`lastMessageTime-${contact.name}`) || "Never";

        contactDiv.innerHTML = `
            <div class="avatar">
                <img src="${contact.profilePic || 'default-profile.jpg'}" alt="Profile Picture">
            </div>
            <div class="contact-info">
                <h4>${contact.name}💕</h4>
                <p>${contact.phone}</p>
            </div>
            <span class="time">${lastMessageTime}</span>
            <span class="delete-contact">🗑</span>
        `;

        contactDiv.querySelector(".delete-contact").addEventListener("click", (event) => {
            event.stopPropagation();
            deleteContact(contact.name);
        });

        contactDiv.addEventListener("click", () => {
            chatContactName.textContent = contact.name;
            chatProfilePic.src = contact.profilePic || "default-profile.jpg";
            activeContact = contact.name;
            lastSeen.textContent = `Last seen: ${lastMessageTime}`;
            loadChatHistory(contact.name);
        });

        contactsContainer.appendChild(contactDiv);
    }

    function loadContacts() {
        contactsContainer.innerHTML = "";
        contactList.forEach(createContactElement);
    }

    function loadChatHistory(contactName) {
        chatMessages.innerHTML = "";
        if (chatHistory[contactName]) {
            chatHistory[contactName].forEach(messageData => {
                const message = document.createElement("div");
                message.classList.add("message", messageData.type);
                message.textContent = messageData.text;
                chatMessages.appendChild(message);
            });
        }
    }

    function sendMessage() {
        if (!activeContact) return;

        const message = messageInput.value.trim();
        if (message === "") return;

        const sentMessage = document.createElement("div");
        sentMessage.classList.add("message", "sent");
        sentMessage.textContent = message;
        chatMessages.appendChild(sentMessage);

        messageInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const currentTime = getCurrentTime();
        lastSeen.textContent = `Last seen: ${currentTime}`;

        const contactElement = [...contactsContainer.children].find(c => c.dataset.name === activeContact);
        if (contactElement) {
            contactElement.querySelector(".time").textContent = currentTime;
        }

        localStorage.setItem(`lastMessageTime-${activeContact}`, currentTime);

        if (!chatHistory[activeContact]) {
            chatHistory[activeContact] = [];
        }
        chatHistory[activeContact].push({ text: message, type: "sent" });

        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
    
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    addContactButton.addEventListener("click", () => {
        const name = prompt("Enter contact name:");
        const phone = prompt("Enter phone number:");
        const profilePic = prompt("Enter profile picture URL (or leave blank):");

        if (name && phone) {
            const newContact = { name, phone, profilePic: profilePic || "default-profile.jpg" };
            contactList.push(newContact);
            localStorage.setItem("contactList", JSON.stringify(contactList));
            loadContacts();
        }
    });
    loadContacts();
    
    
});
