using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class MonologueController : MonoBehaviour
{
    public static MonologueController Instance;

    [Header("Components")]
    public GameObject monologueObj;
    public GameObject timer;
    public GameObject timerController;
    public GameObject moveArrowRight;
    public GameObject moveArrowLeft;
    public GameObject lightTgl;

    public GameObject player;

    public GameObject monster1;
    public GameObject monster2;
    public GameObject soundManager;
    public Image profile;
    public Text speechText;
    public Text actorNameText;

    [Header("dialogue Buttons")]
    public GameObject nextButton;

    [Header("Settings")]
    public float typingSpeed;

    [Header("Fala Inicial")]
    public string[] falaInicial;

    [Header("Fala da Porta Emperrada")]
    public string[] portaEmperrada;

    [Header("Fala da Sala Escura")]
    public string[] ligarLanterna;

    [Header("Fala de Desligar a Lanterna")]
    public string[] desligarLanterna;

    [Header("Fala da Primeira Captura")]
    public string[] primeiraCaptura;

    private string[] sentences;
    public Sprite imagePlayer;
    public Sprite imageSound;
    public string nome;
    public string anunciante;
    private int index;
    private int controleDeFala = 0;

    private bool falouPraLigarLanterna = false;
    private bool falouPraDesligarLanterna = false;

    private GameObject activeMonster;
    private bool monsterNear = false;

    private bool falaAnunciante1 = true;
    private bool jaFalouAnunciante1 = false;
    private bool fimFalaAnunciante1 = false;

    private bool fimFalaAnunciante2 = false;

    private bool captured = false;
    private bool alreadyCaptureOnce = false;
    
    private bool acceptInput;
    private int lettersTyped;
    private bool mouseClicked;
    private Dialogue[] dialogues;


    private void Start() {

        Instance = this;

        dialogues = FindObjectsOfType<Dialogue>();
        
        List<Dialogue> dialoguesList = dialogues.ToList();
        dialoguesList.RemoveAll(item => item.gameObject.TryGetComponent<Door>(out Door component));
        dialogues = dialoguesList.ToArray();
        dialoguesList = null;

        timer.SetActive(false);
        moveArrowRight.SetActive(false);
        moveArrowLeft.SetActive(false);
        lightTgl.SetActive(false);

        Speech(falaInicial);
    }

    void Update()
    {   
        if (falouPraLigarLanterna == false) {

            int playerRoom = player.GetComponent<PlayerController>().GetRoomIndex();

            if (playerRoom == 6) {
                monster1.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster1;
                falouPraLigarLanterna = true;
                Speech(ligarLanterna);
            } else if (playerRoom == 8) {
                monster2.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster2;
                falouPraLigarLanterna = true;
                Speech(ligarLanterna);
            }
            
        } else if (falouPraDesligarLanterna == false) {

            int playerRoom = player.GetComponent<PlayerController>().GetRoomIndex();

            if (playerRoom == 6) {
                monsterNear = monster1.GetComponent<Monster1>().IsNearPlayer();
                activeMonster = monster1;
            } else if (playerRoom == 8) {
                monsterNear = monster2.GetComponent<Monster1>().IsNearPlayer();
                activeMonster = monster2;
            }

            if(monsterNear && playerRoom == 6) {
                monster1.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster1;
                falouPraDesligarLanterna = true;
                Speech(desligarLanterna);
            } else if(monsterNear && playerRoom == 8) {
                monster2.GetComponent<Monster1>().StartDialogue();
                activeMonster = monster2;
                falouPraDesligarLanterna = true;
                Speech(desligarLanterna);
            }

        }

        if (captured == true && alreadyCaptureOnce == false) {
            alreadyCaptureOnce = true;
            Speech(primeiraCaptura);
        }

    }

    public void Captured() {
        captured = true;
    }

    public void Speech(string[] txt) {
        // NoOp if talking to someone else
        if (isAlreadySpeaking()) {
            return;
        }

        timerController.GetComponent<TimerController>().PauseTimer();
        player.GetComponent<PlayerController>().StopMoving();
        moveArrowRight.SetActive(false);
        moveArrowLeft.SetActive(false);


        speechText.text = "";
        monologueObj.SetActive(true);
        sentences = txt;
        index = 0;

        StartCoroutine(TypeSentence(false, false));
    }

    private bool isAlreadySpeaking() {
        for (var i = 0; i < dialogues.Length; ++i) {
            if (dialogues[i].onDialogue == true) {
                return true;
            }
        }

        return false;
    }

    IEnumerator TypeSentence(bool isAnunciante, bool isAnunciante2)
    {
        if (isAnunciante)
        {
            profile.sprite = imageSound;
            actorNameText.text = anunciante;
            soundManager.GetComponent<SoundManager>().playAnuncioTimer();
            fimFalaAnunciante1 = true;
        }
        else if(isAnunciante2)
        {
            profile.sprite = imageSound;
            actorNameText.text = anunciante;
            fimFalaAnunciante2 = true;
        } 
        else
        {
            profile.sprite = imagePlayer;
            actorNameText.text = nome;
        }

        float elapsedTime = 0f;

        for (int i = 0; i < sentences[index].Length; i++)
        {
            //SFX Fala:
            SoundManager.instance.playTextSFX((int)SoundManager.ListaSFX.sonoroTexto, actorNameText.text);

            speechText.text += sentences[index][i];

            elapsedTime = 0f;
            while (elapsedTime < typingSpeed)
            {
                elapsedTime += Time.deltaTime;

                if (Input.GetMouseButtonDown(0) || Input.GetAxis("Interact") > 0)
                {
                    mouseClicked = true;
                    break;
                }

                yield return null; 
            }

            if (mouseClicked)
            {
                speechText.text = sentences[index];
                break;
            }
        }
            
    }

    public void NextSentence()
    {

        if (speechText.text == sentences[index] && mouseClicked == false)
        {
            //SFX Click:
            SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroClick);

            if (index < sentences.Length - 1)
            {
                index++;
                speechText.text = "";

                if (falaAnunciante1 && !jaFalouAnunciante1 && !fimFalaAnunciante2)
                {
                    jaFalouAnunciante1 = true;
                    StartCoroutine(TypeSentence(true, false));
                    
        
                } else if(fimFalaAnunciante1 && !fimFalaAnunciante2)
                {
                    StartCoroutine(TypeSentence(false, true));
                }
                else
                {
                    StartCoroutine(TypeSentence(false, false));
                }
                
            }
            else
            {

                speechText.text = "";
               
                monologueObj.SetActive(false);

                if (controleDeFala == 0) {
                    controleDeFala++;
                    timer.SetActive(true);

                    Speech(portaEmperrada);

                } else if(controleDeFala == 1) {

                    controleDeFala++;

                    timerController.GetComponent<TimerController>().ResumeTimer();

                    moveArrowRight.SetActive(true);
                    moveArrowLeft.SetActive(true);

                } else if(controleDeFala == 2) {

                    falouPraLigarLanterna = true;
                    controleDeFala++;

                    timerController.GetComponent<TimerController>().ResumeTimer();

                    lightTgl.SetActive(true);
                    moveArrowRight.SetActive(true);
                    moveArrowLeft.SetActive(true);
                    activeMonster.GetComponent<Monster1>().StopDialogue();
                } else {
                    falouPraDesligarLanterna = true;

                    timerController.GetComponent<TimerController>().ResumeTimer();

                    moveArrowRight.SetActive(true);
                    moveArrowLeft.SetActive(true);
                    activeMonster.GetComponent<Monster1>().StopDialogue();
                    
                }
            }
        }
        mouseClicked = false;
    }
}
