using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SoundManager : MonoBehaviour
{
    //Scene Manager:
    private Scene currentScene;

    //Lista de M�sicas:
    [SerializeField] private AudioClip ambienteTrem;
    [SerializeField] private AudioClip sonoroTrem;
    [SerializeField] private AudioClip sonoroMonstroN;
    [SerializeField] private AudioClip sonoroMonstroC;
    [SerializeField] private AudioClip aununcioTremInicio;
    [SerializeField] private AudioClip aununcioTrem1;
    [SerializeField] private AudioClip aununcioTrem2;
    [SerializeField] private AudioClip aununcioTrem3;
    [SerializeField] private AudioClip aununcioTrem4;
    [SerializeField] private AudioClip aununcioTrem5;
    [SerializeField] private AudioClip aununcioTrem6;
    [SerializeField] private AudioClip aununcioTrem7;

    //Vetor Lista de M�sicas:
    private AudioClip[] selectBGM;

    //Vetor Auxiliar Lista de M�sicas:
    public enum ListaBGM
    {
        ambienteTrem,
        sonoroTrem,
        sonoroMonstroN,
        sonoroMonstroC,
        aununcioTremInicio,
        aununcioTrem1,
        aununcioTrem2,
        aununcioTrem3,
        aununcioTrem4,
        aununcioTrem5,
        aununcioTrem6,
        aununcioTrem7,
    };

    //Lista de Efeitos:
    [SerializeField] private AudioClip menuLuz;

    //Vetor Lista de Efeitos:
    private AudioClip[] selectSFX;

    //Vetor Auxiliar Lista de Efeitos:
    public enum ListaSFX
    {
        menuLuz
    };

    //Lista de AudioSources Simult�neos:
    public AudioSource bgmGame1;
    public AudioSource bgmGame2;
    public AudioSource bgmGame3;
    public AudioSource bgmGame4;
    public AudioSource sfxMenu;
    public AudioSource sfxGame;

    //Outras Vari�veis:
    public static SoundManager instance;
    private float anuncioSFX = 100.0f;
    private float timerAnuncio = 95.0f;
    private bool segurarAnuncio = false;
    private bool setFade = false;
    private bool falouPrimeiroAnuncio = false;
    private bool deveFalarPrimeiroAnuncio = false;
    private float timerFade = 0.95f;

    //Inicia��o do SoundManager:
    void Awake()
    {
        //Scene Manager:
        currentScene = SceneManager.GetActiveScene();

        //Setar Inst�ncia:
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
            sonoroTrem,
            sonoroMonstroN,
            sonoroMonstroC,
            aununcioTremInicio,
            aununcioTrem1,
            aununcioTrem2,
            aununcioTrem3,
            aununcioTrem4,
            aununcioTrem5,
            aununcioTrem6,
            aununcioTrem7,
        };

        //Setar Vetor de SFX:
        selectSFX = new AudioClip[]
        {
            menuLuz
        };

        //Carregar BGM - Cena do Trem:
        if (currentScene.name == "TrainScene")
        {
            playBGM(0, 1);
        }
    }

    void Update()
    {
        //Tema do Trem e An�ncios:
        if (currentScene.name == "TrainScene")
        {
            if (falouPrimeiroAnuncio)
            {
                timerAnuncio = timerAnuncio + Time.deltaTime;
                if (!segurarAnuncio && timerAnuncio >= anuncioSFX)
                {
                    playBGM(1, 2);
                    segurarAnuncio = true;
                }
                else if (segurarAnuncio && !bgmGame2.isPlaying)
                {
                    playBGM(UnityEngine.Random.Range(3, 10), 2);
                    segurarAnuncio = false;
                    timerAnuncio = 0f;
                }
            } else if (deveFalarPrimeiroAnuncio)
            {
                deveFalarPrimeiroAnuncio = false;
                falouPrimeiroAnuncio = true;
                playBGM(4, 2);
                segurarAnuncio = false;
                timerAnuncio = 0f;
            }
            
        }

        //Fade BGM Din�mica:
        if (setFade)
        {
            //Decrescer:
            bgmGame3.volume = (float)bgmGame3.volume * timerFade;
            bgmGame4.volume = (float)bgmGame4.volume * timerFade;

            //Desligar:
            if (bgmGame3.volume < 0.01f && bgmGame4.volume < 0.01f)
            {
                setFade = false;
                bgmGame3.Stop();
                bgmGame4.Stop();
                bgmGame3.clip = null;
                bgmGame4.clip = null;
            }
        }
    }

    //Tocar BGM:
    public void playBGM(int lista,int track)
    {
        //Checar AudioSource BGM1:
        if (bgmGame1.clip != selectBGM[lista] && track == 1)
        {
            //Tocar Nova M�sica:
            bgmGame1.clip = selectBGM[lista];
            bgmGame1.Play();
        }

        //Checar AudioSource BGM2:
        if (bgmGame2.clip != selectBGM[lista] && track == 2)
        {
            //Tocar Nova M�sica:
            bgmGame2.clip = selectBGM[lista];
            bgmGame2.Play();
        }
    }

    //Parar BGM:
    public void stopBGM(int track)
    {
        //Checar AudioSource BGM1:
        if (track == 1)
        {
            bgmGame1.Stop();
            bgmGame1.clip = null;
        }

        //Checar AudioSource BGM2:
        if (track == 2)
        {
            bgmGame2.Stop();
            bgmGame2.clip = null;
        }
    }

    //Tocar BGM Din�mica:
    public void playDinamicBGM(int lista1, int lista2, int track)
    {
        //Set Fade:
        setFade = false;

        //Track Normal:
        if (track == 1)
        {
            bgmGame3.volume = 1.0f;
            bgmGame4.volume = 0.0f;
            Debug.Log("Trilha 1");
        }

        //Track Cr�tica:
        if (track == 2)
        {
            bgmGame3.volume = 0.0f;
            bgmGame4.volume = 1.0f;
            Debug.Log("Trilha 2");
        }

        //AudioSource Zerado:
        if (bgmGame3.clip != selectBGM[lista1] && bgmGame4.clip != selectBGM[lista2])
        {
            //Ligar BGM:
            bgmGame3.clip = selectBGM[lista1];
            bgmGame4.clip = selectBGM[lista2];

            bgmGame3.Play();
            bgmGame4.Play();
        }
    }

    //Parar BGM Din�mica com Fade:
    public void stopDinamicBGM()
    {
        setFade = true;
    }

    //Tocar SFX Menu:
    public void playMenuSFX(int lista)
    {
        sfxMenu.PlayOneShot(selectSFX[lista]);
    }

    //Tocar SFX Game:
    public void playSFX(int lista)
    {
        if (!sfxGame.isPlaying)
        {
            sfxGame.clip = selectBGM[lista];
            sfxGame.Play();
        }
    }

    //Parar SFX Game:
    public void stopSFX()
    {
        sfxGame.Stop();
        sfxGame.clip = null;
    }

    public void playAnuncioTimer()
    {
        deveFalarPrimeiroAnuncio = true;
    }
}
