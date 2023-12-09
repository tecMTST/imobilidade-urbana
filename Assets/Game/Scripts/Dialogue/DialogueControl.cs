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

    public Action onDialogueClose;
    public Action onBeforeSpeech;
    public Action onSpeech;

    public static DialogueControl Instance;

    private void Start() {
        Instance = this;
    }

    public void Speech(Sprite[] p, string[] txt, string[] actorName) {

        onBeforeSpeech();

        speechText.text = "";
        dialogueObj.SetActive(true);
        sprites = p;
        sentences = txt;
        names = actorName;

        foreach (object obj in sprites) {
            print(sprites.Length);
        }

        ResetDialogue();

        if (names[0] == "Irmãos") {

           
            nextButton.SetActive(false);
            continueGroup.SetActive(true);

        } else {
            continueGroup.SetActive(false);
            nextButton.SetActive(true);
        }

        StartCoroutine(TypeSentence());

        onSpeech();

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
                speechText.text = "";
               
                dialogueObj.SetActive(false);
            }
        }
    }

    public void Close()
    {
        dialogueObj.SetActive(false);
        onDialogueClose();
        
    }

    public void ResetDialogue() {
        index = 0;


    }

   

}
