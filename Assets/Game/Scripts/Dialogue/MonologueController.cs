using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class MonologueController : MonoBehaviour
{
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

    private bool falaAnunciante = true;
    private bool jaFalouAnunciante = false;

    private bool captured = false;
    private bool alreadyCaptureOnce = false;
    
    private bool acceptInput;
    private int lettersTyped;
    private bool mouseClicked;
    


    private void Start() {
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

        timerController.GetComponent<TimerController>().PauseTimer();
        player.GetComponent<PlayerController>().StopMoving();
        moveArrowRight.SetActive(false);
        moveArrowLeft.SetActive(false);


        speechText.text = "";
        monologueObj.SetActive(true);
        sentences = txt;
        index = 0;

        StartCoroutine(TypeSentence(false));
    }



    IEnumerator TypeSentence(bool isAnunciante)
    {
        if (isAnunciante)
        {
            profile.sprite = imageSound;
            actorNameText.text = anunciante;
            soundManager.GetComponent<SoundManager>().playAnuncioTimer();
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

                if (Input.GetMouseButtonDown(0))
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
        //SFX Click:
        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroClick);

        if (speechText.text == sentences[index] && mouseClicked == false)
        {
            if (index < sentences.Length - 1)
            {
                index++;
                speechText.text = "";

                if (falaAnunciante && !jaFalouAnunciante){
                    jaFalouAnunciante = true;
                    StartCoroutine(TypeSentence(true));
                } else
                {
                    StartCoroutine(TypeSentence(false));
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
