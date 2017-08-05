app.config = {
    domain: null,
    api: '/private/api',
    request: {
        options: function(){
            return {
                loader: app.device.isMobile,
                notify: true
            }
        }
    },
    logger: {
        method: "addLog",
        report: true
    },
    metrika: {
        active: true,
        report: {
            method: "addMetrika",
            interval: 30,
            yametrika: {
                counter: '27428363'
            }
        }
    },
    payment: {
        yamoney: '410012719414223'
    },
    profile: {
        photo: {
            minWidth: 440,
            maxHeight: 620
        }
    },
    resume: {
        free: {
            autoSave: {
                interval: 15
            }
        }
    },
    share: {
        title: 'Создать крутое резюме и получить престижную работу, здесь на ResumeKraft.ru'
    },
    changeStyles: true
};
