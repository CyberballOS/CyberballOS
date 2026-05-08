Qualtrics.SurveyEngine.addOnload(function() {
    this.hideNextButton();
});

Qualtrics.SurveyEngine.addOnReady(function() {
    let that = this;
    let bestMessage = null;
    let pendingTimeout = null;

    function handleSurveyMessage(msg) {
        if (!msg.data || typeof msg.data !== 'object') return;
        if (!msg.data.game_log) return;
        if (window._cyberballProcessed) return;

        if (!bestMessage || msg.data.game_log.length > bestMessage.game_log.length) {
            bestMessage = msg.data;
        }

        if (pendingTimeout) clearTimeout(pendingTimeout);
        pendingTimeout = setTimeout(() => {
            if (window._cyberballProcessed) return;
            window._cyberballProcessed = true;
            window.removeEventListener('message', handleSurveyMessage);

            for (const [key, value] of Object.entries(bestMessage)) {
                if (key === "player_throws_list") {
                    for (const [throwPath, numThrows] of Object.entries(value)) {
                        Qualtrics.SurveyEngine.setEmbeddedData(throwPath, numThrows);
                    }
                } else {
                    Qualtrics.SurveyEngine.setEmbeddedData(key, JSON.stringify(value));
                }
            }

            setTimeout(() => { that.clickNextButton(); }, 3000);
        }, 500);
    }

    window.addEventListener('message', handleSurveyMessage);
});