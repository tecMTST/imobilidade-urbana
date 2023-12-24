using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using System;

public class DialogueControl : MonoBehaviour
{
    [Header("Components")]
    public GameObject dialogueObj;
    public Image profile;
    public Text speechText;
    public Text actorNameText;

    [Header("dialogue Buttons")]
    public GameObject nextButton;
    public GameObject continueGroup;

    [Header("Settings")]
    [Range(0, 0.5f)] public float typingSpeed;

    private string[] sentences;
    private Sprite[] sprites;
    private string[] names;
    public int index;

    

    public Action onDialogueClose = () => { };
    public Action onRefuseBros = () => { };
    public Action onBrosConcluded = () => { };

    public static DialogueControl Instance;

    public bool isBros = false;

    private void Start() {
        Instance = this;
    }

    public void Speech(Sprite[] p, string[] txt, string[] actorName) {


        speechText.text = "";
        dialogueObj.SetActive(true);
        sprites = p;
        sentences = txt;
        names = actorName;

        //foreach (object obj in sprites) {
        //    print(sprites.Length);
        //}

        ResetDialogue();

        if (isBros) {

           
            nextButton.SetActive(false);
            continueGroup.SetActive(true);

        } else {
            continueGroup.SetActive(false);
            nextButton.SetActive(true);
        }

        StartCoroutine(TypeSentence());


    }

    IEnumerator TypeSentence()
    {
        profile.sprite  = sprites[index];
        actorNameText.text = names[index];
        foreach (char letter in sentences[index].ToCharArray())
        {
            speechText.text += letter;
            yield return new WaitForSeconds(typingSpeed);
        }
    }

    public void NextSentence()
    {
        if(speechText.text == sentences[index])
        {
            if (index < sentences.Length - 1)
            {
                index++;
                speechText.text = "";
                StartCoroutine(TypeSentence());
            }
            else
            {
                Close();
               
            }
        }
    }

    public void Close()
    {
        speechText.text = "";
        dialogueObj.SetActive(false);
        onDialogueClose();

        if (isBros)
            onBrosConcluded();



    }

    public void ResetDialogue() {


        index = 0;

        //speechText.text = "";
        //dialogueObj.SetActive(false);
        //onDialogueClose();


    }

    public void OnRefuseBros() {

        speechText.text = "";
        dialogueObj.SetActive(false);
        onDialogueClose();

        onRefuseBros();
    }

   

}
