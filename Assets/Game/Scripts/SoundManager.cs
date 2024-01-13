using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.SocialPlatforms;

public class SoundManager : MonoBehaviour
{
    //Scene Manager:
    private Scene currentScene;

    //Lista de Musicas:
    [SerializeField] private AudioClip ambienteTrem;

    [SerializeField] private AudioClip musicaChase;
    [SerializeField] private AudioClip musicaGameOver;
    [SerializeField] private AudioClip musicaFinal;
    [SerializeField] private AudioClip aununcioTema;
    [SerializeField] private AudioClip aununcioTremInicio;
    [SerializeField] private AudioClip aununcioTrem1;
    [SerializeField] private AudioClip aununcioTrem2;
    [SerializeField] private AudioClip aununcioTrem3;
    [SerializeField] private AudioClip aununcioTrem4;
    [SerializeField] private AudioClip aununcioTrem5;
    [SerializeField] private AudioClip aununcioTrem6;
    [SerializeField] private AudioClip musicaNPCSalvo;

    //Vetor Lista de Musicas:
    private AudioClip[] selectBGM;

    //Vetor Auxiliar Lista de Musicas:
    public enum ListaBGM
    {
        ambienteTrem,
        musicaChase,
        musicaGameOver,
        musicaFinal,
        aununcioTema,
        aununcioTremInicio,
        aununcioTrem1,
        aununcioTrem2,
        aununcioTrem3,
        aununcioTrem4,
        aununcioTrem5,
        aununcioTrem6,
        musicaNPCSalvo
    };


    //Lista de Efeitos:
    [SerializeField] private AudioClip sonoroLuz;
    [SerializeField] private AudioClip sonoroScream;
    [SerializeField] private AudioClip sonoroTimer;
    [SerializeField] private AudioClip sonoroClick;
    [SerializeField] private AudioClip sonoroTexto;
    [SerializeField] private AudioClip sonoroCatch;

    //Vetor Lista de Efeitos:
    private AudioClip[] selectSFX;

    //Vetor Auxiliar Lista de Efeitos:
    public enum ListaSFX
    {
        sonoroLuz,
        sonoroScream,
        sonoroTimer,
        sonoroClick,
        sonoroTexto,
        sonoroCatch
    };

    //Lista de AudioSources Simultaneos:
    public AudioSource bgmAmbiente;
    public AudioSource bgmAnuncios;
    public AudioSource bgmChase;
    public AudioSource bgmTela;
    public AudioSource sfxMenu;
    public AudioSource sfxTexto;
    public AudioSource sfxScream;
    public AudioSource sfxTimer;

    //Outras Variaveis:
    public static SoundManager instance;
    private float anuncioSFX = 100.0f;
    private float timerAnuncio = 0.0f;
    private bool segurarAnuncio = false;
    private bool setFade = false;
    private bool falouPrimeiroAnuncio = false;
    private bool deveFalarPrimeiroAnuncio = false;
    private float timerFade = 0.95f;
    private bool isTimePaused;

    public GameObject timerController;

    //Iniciar SoundManager:
    void Awake()
    {
        //Scene Manager:
        currentScene = SceneManager.GetActiveScene();

        //Setar Instancia:
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }

        //Setar Vetor de BGM:
        selectBGM = new AudioClip[]
        {
            ambienteTrem,
            musicaChase,
            musicaGameOver,
            musicaFinal,
            aununcioTema,
            aununcioTremInicio,
            aununcioTrem1,
            aununcioTrem2,
            aununcioTrem3,
            aununcioTrem4,
            aununcioTrem5,
            aununcioTrem6,
            musicaNPCSalvo
        };

        //Setar Vetor de SFX:
        selectSFX = new AudioClip[]
        {
            sonoroLuz,
            sonoroScream,
            sonoroTimer,
            sonoroClick,
            sonoroTexto,
            sonoroCatch
        };

        //Carregar BGM - Cena do Trem:
        if (currentScene.name == "TrainScene")
        {
            playBGM((int)ListaBGM.ambienteTrem, 1);
        }
    }

    void Update()
    {
        isTimePaused = timerController.GetComponent<TimerController>().GetIsPaused();
        //Tema do Trem e Anuncios:
        if (currentScene.name == "TrainScene")
        {
            if (falouPrimeiroAnuncio && isTimePaused == false)
            {
                timerAnuncio = timerAnuncio + Time.deltaTime;
                if (!segurarAnuncio && timerAnuncio >= anuncioSFX)
                {
                    playBGM((int)ListaBGM.aununcioTema, 2);
                    segurarAnuncio = true;
                }
                else if (segurarAnuncio && !bgmAnuncios.isPlaying)
                {
                    playBGM(UnityEngine.Random.Range(6, 10), 2);
                    segurarAnuncio = false;
                    timerAnuncio = 0f;
                }
            } else if (deveFalarPrimeiroAnuncio)
            {
                deveFalarPrimeiroAnuncio = false;
                falouPrimeiroAnuncio = true;
                playBGM((int)ListaBGM.aununcioTremInicio, 2);
                segurarAnuncio = false;
                timerAnuncio = 0f;
            }
        }

        //Fade AudioSource Chase:
        if (setFade)
        {
            //Decrescer:
            bgmChase.volume = (float)bgmChase.volume * timerFade;

            //Desligar:
            if (bgmChase.volume < 0.01f)
            {
                setFade = false;
                bgmChase.Stop();
                bgmChase.clip = null;
            }
        }
    }

    //Tocar BGM:
    public void playBGM(int lista,int track)
    {
        //AudioSource Ambiente:
        if (bgmAmbiente.clip != selectBGM[lista] && track == 1)
        {
            //Tocar Nova Musica:
            bgmAmbiente.clip = selectBGM[lista];
            bgmAmbiente.Play();
        }

        //AudioSource Anuncios:
        if (bgmAnuncios.clip != selectBGM[lista] && track == 2)
        {
            //Tocar Nova Musica:
            bgmAnuncios.clip = selectBGM[lista];
            bgmAnuncios.Play();
        }

        //AudioSource Chase:
        if (track == 3)
        {
            //Tocar Nova Musica:
            bgmChase.clip = selectBGM[lista];
            bgmChase.Play();
            bgmChase.volume = 1;
            setFade = false;
        }

        //AudioSource Tela:
        if (bgmTela.clip != selectBGM[lista] && track == 4)
        {
            //Tocar Nova Musica:
            bgmTela.clip = selectBGM[lista];
            bgmTela.Play();
        }
    }

    //Parar BGM:
    public void stopBGM(int track)
    {
        //AudioSource Ambiente:
        if (track == 1)
        {
            bgmAmbiente.Stop();
            bgmAmbiente.clip = null;
        }

        //AudioSource Anuncios:
        if (track == 2)
        {
            bgmAnuncios.Stop();
            bgmAnuncios.clip = null;
        }

        //AudioSource Chase:
        if (track == 3)
        {
            setFade = true;
        }

        //AudioSource Tela:
        if (track == 4)
        {
            bgmAmbiente.Stop();
            bgmTela.clip = null;
        }
    }

    //Tocar SFX Menu:
    public void playMenuSFX(int lista)
    {
        sfxMenu.PlayOneShot(selectSFX[lista]);
    }

    //Tocar SFX Texto:
    public void playTextSFX(int lista, string actorName)
    {
        if (actorName == "Eu")
        {
            sfxTexto.pitch = 1.0f;
        }
        else if (actorName == "Anunciante")
        {
            sfxTexto.pitch = 1.0f;
        }
        else if (actorName == "Dona Maria")
        {
            sfxTexto.pitch = 1.2f;
        }
        else if (actorName == "Wellington")
        {
            sfxTexto.pitch = 0.85f;
        }
        else if (actorName == "Mais velho" || actorName == "Michael")
        {
            sfxTexto.pitch = 0.95f;
        }
        else if (actorName == "Caçula" || actorName == "Jackson")
        {
            sfxTexto.pitch = 1.1f;
        }

        sfxTexto.PlayOneShot(selectSFX[lista]);

    }

    //Tocar SFX Scream:
    public void playScreamSFX(int lista)
    {
        sfxScream.PlayOneShot(selectSFX[lista]);
    }

    //Tocar SFX Timer:
    public void playTimerSFX(int lista)
    {
        sfxTimer.PlayOneShot(selectSFX[lista]);
    }

    //SFX Primeiro Anúncio:
    public void playAnuncioTimer()
    {
        deveFalarPrimeiroAnuncio = true;
    }
}
