const MINUTE = 60000;
const MIN_BPM = 40;
const MAX_BPM = 400;
const MAX_BEATS = 16;

const MetronomeApp = () => {
    let state = {
        counter: 1,
        beatCount: 1,
        isPlaying: false,
        timeoutIds: [],
        subdivision: 1,
        subCount: 0
    };

    const buttonTimeline = gsap.timeline();
    const flashTimeline = gsap.timeline();

    const animateButtonClick = (element) => {
        gsap.to(element, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    };

    const animateBeatFlash = (beatCount, isMainBeat) => {
        const flashElement = document.getElementById('beatFlash');
        flashElement.className = 'beat-flash';
        flashElement.classList.add(`color-${isMainBeat ? beatCount % 5 + 1 : 1}`);

        gsap.fromTo(flashElement, 
            { opacity: isMainBeat ? 0.4 : 0.2 },
            { 
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            }
        );
    };

    const animateBeatButton = (isMainBeat) => {
        const beatButton = document.querySelector('.beat');
        if (beatButton) {
            gsap.to(beatButton, {
                backgroundColor: isMainBeat ? '#CBD5E1' : '#64748B',
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    };

    const setupAudio = () => ({
        main: document.querySelector('.audio'),
        beat: new Audio('files/beat.wav'),
        sub: new Audio('files/click.mp3')
    });

    const calculateSubdivisionInterval = (bpm, subdivision) => {
        const quarterNoteMs = MINUTE / bpm;
        switch(subdivision) {
            case 1: return quarterNoteMs;
            case 2: return quarterNoteMs / 2;
            case 3: return quarterNoteMs / 3;
            case 4: return quarterNoteMs / 4;
            case 5: return quarterNoteMs / 6;
            case 6: return quarterNoteMs / 8;
            case 7: return quarterNoteMs / 12;
            case 8: 
                return state.subCount % 2 === 0 ? quarterNoteMs * 0.6 : quarterNoteMs * 0.4;
            default: return quarterNoteMs;
        }
    };

    const incrementBeat = R.pipe(
        R.inc,
        R.when(R.gt(R.__, MAX_BEATS + 1), R.always(1))
    );

    const decrementBeat = R.pipe(
        R.dec,
        R.when(R.equals(0), R.always(MAX_BEATS))
    );

    const getBPM = () => {
        const value = Number(document.querySelector('.txt1').value);
        return Math.min(Math.max(value, MIN_BPM), MAX_BPM);
    };

    const updateBeatDisplay = (beatNum) => {
        const beatButton = document.querySelector('.beat');
        if (beatButton) {
            beatButton.textContent = `Beat: ${beatNum}`;
        }
    };

    const handleSubdivisionClick = (audio) => (event) => {
        const buttons = document.querySelectorAll('.subdivision-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        state.subdivision = Number(event.target.dataset.value);
        if (state.isPlaying) {
            handleStop(audio)();
            handlePlay(audio)({ target: document.querySelector('.add') });
        }
    };

    const handleBPMChange = (audio) => (event) => {
        const newBPM = Number(event.target.value);
        
        if (newBPM >= MIN_BPM && newBPM <= MAX_BPM) {
            if (state.isPlaying) {
                handleStop(audio)();
                handlePlay(audio)({ target: document.querySelector('.add') });
            }
        }
    };

    const handlePlay = (audio) => (event) => {
        if (!state.isPlaying) {
            state.isPlaying = true;
            event.target.setAttribute('disabled', 'disabled');
            
            if (state.counter === 1) {
                document.querySelector('.increment').click();
            }
            
            gsap.from('.metronome-controls', {
                scale: 0.95,
                opacity: 0.8,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
            
            playLogic(audio, getBPM());
        }
    };

    const handleStop = (audio) => () => {
        state.isPlaying = false;
        audio.main.pause();
        audio.beat.pause();
        audio.sub.pause();
        audio.main.currentTime = 0;
        audio.beat.currentTime = 0;
        audio.sub.currentTime = 0;
        
        state.timeoutIds.forEach(clearTimeout);
        state.timeoutIds = [];
        
        document.querySelector('.add').removeAttribute('disabled');
        state.beatCount = 1;
        state.subCount = 0;

        gsap.to('.metronome-controls', {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const playLogic = (audio, bpm) => {
        if (!state.isPlaying) return;

        const interval = calculateSubdivisionInterval(bpm, state.subdivision);
        
        const timeoutId = setTimeout(() => {
            state.subCount++;
            
            const isMainBeat = state.subCount % state.subdivision === 1;
            
            if (isMainBeat) {
                state.beatCount = R.inc(state.beatCount);
                
                if (state.beatCount > state.counter) {
                    state.beatCount = 1;
                }

                if (state.beatCount === 1) {
                    audio.beat.currentTime = 0;
                    audio.beat.play().catch(console.error);
                    animateBeatFlash(state.counter, true);
                } else {
                    audio.main.currentTime = 0;
                    audio.main.play().catch(console.error);
                    animateBeatFlash(state.beatCount, true);
                }
            } else {
                audio.sub.currentTime = 0;
                audio.sub.play().catch(console.error);
                animateBeatFlash(state.beatCount, false);
            }
            
            animateBeatButton(isMainBeat);
            
            if (state.subCount >= state.subdivision) {
                state.subCount = 0;
            }
            
            playLogic(audio, bpm);
        }, Math.max(10, interval));
        
        state.timeoutIds.push(timeoutId);
    };

    const bindEvents = (audio) => {
        const startButton = document.querySelector('.add');
        const stopButton = document.querySelector('.stop');
        const incrementButton = document.querySelector('.increment');
        const decrementButton = document.querySelector('.decrement');
        const form = document.querySelector('.form1');
        const subdivisionButtons = document.querySelectorAll('.subdivision-btn');
        const bpmInput = document.querySelector('.txt1');

        if (startButton) {
            startButton.addEventListener('click', (e) => {
                animateButtonClick(e.target);
                handlePlay(audio)(e);
            });
        }

        if (stopButton) {
            stopButton.addEventListener('click', (e) => {
                animateButtonClick(e.target);
                handleStop(audio)();
            });
        }

        if (incrementButton) {
            incrementButton.addEventListener('click', (e) => {
                animateButtonClick(e.target);
                state.counter = incrementBeat(state.counter);
                updateBeatDisplay(state.counter);
            });
        }

        if (decrementButton) {
            decrementButton.addEventListener('click', (e) => {
                animateButtonClick(e.target);
                state.counter = decrementBeat(state.counter);
                updateBeatDisplay(state.counter);
            });
        }

        subdivisionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                animateButtonClick(e.target);
                handleSubdivisionClick(audio)(e);
            });
        });

        if (bpmInput) {
            bpmInput.addEventListener('input', handleBPMChange(audio));
            bpmInput.addEventListener('change', handleBPMChange(audio));
        }

        if (form) {
            form.addEventListener('submit', (e) => e.preventDefault());
        }

        gsap.from('.metronome-controls', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    };

    const initialize = () => {
        const audio = setupAudio();
        bindEvents(audio);
        
        // Set initial max BPM
        const bpmInput = document.querySelector('.txt1');
        if (bpmInput) {
            bpmInput.setAttribute('max', MAX_BPM);
        }
    };

    return {
        initialize
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const app = MetronomeApp();
    app.initialize();
});