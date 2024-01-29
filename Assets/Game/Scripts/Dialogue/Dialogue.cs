using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Dialogue : MonoBehaviour
{
    public Sprite[] profile;
    public string[] speechTxt;
    public string[] actorName;

    public LayerMask playerLayer;
    public LayerMask npcLayer;
    public float radius;

    [HideInInspector]
    public DialogueControl dc;

    private bool onRadius;
    public bool onDialogue;

    private Dialogue[] dialogues;

    private void Start()
    {
        dc = FindObjectOfType<DialogueControl>();
        dialogues = FindObjectsOfType<Dialogue>();
    }

    private void Update() 
    {
        #region Inserido na classe Quest
        //if (onRadius) {

        //    if ((Input.GetMouseButtonDown(0) || Input.touchCount > 0) && onRadius && !onDialogue) {
        //        Vector3 clickPosition;

        //        if (Input.touchCount > 0) {
        //            Touch touch = Input.GetTouch(0);
        //            clickPosition = Camera.main.ScreenToWorldPoint(touch.position);
        //        } else {
        //            clickPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        //        }

        //        clickPosition.z = 0;

        //        Vector2 clickPosition2D = new Vector2(clickPosition.x, clickPosition.y);

        //        Collider2D hitCollider = Physics2D.OverlapPoint(clickPosition2D, npcLayer);

        //        if (hitCollider != null && hitCollider.gameObject == gameObject) {

        //        }
        //    }

        //}
        #endregion
    }



    public void StartSpeech() {

        //if (onDialogue) {
        //    onDialogue = false;
        //    dc.Close();
        //    return;
        //}

        if (this.gameObject.name == "Irmaos")
            dc.isBros = true;
        else
            dc.isBros = false;

        onDialogue = true;
        dc.Speech(profile, speechTxt, actorName);
        dc.onDialogueClose =() => onDialogue = false;
    }

    

    public void StartSpeech(Sprite[] Profile, string[] SpeechTxt, string[] ActorName) {
        // NoOp if already on dialogue
        if (isAlreadySpeaking()) {
            return;
        }

        if (this.gameObject.name == "Irmaos")
            dc.isBros = true;
        else
            dc.isBros = false;

        onDialogue = true;
        dc.Speech(Profile, SpeechTxt, ActorName);
        //dc.onDialogueClose = () => { this.onDialogue = false; print($"On Dialogue{onDialogue}"); };
        dc.onDialogueClose = () => onDialogue = false;
    }


    private bool isAlreadySpeaking() {
        Dialogue curr;
        for (var i = 0; i < dialogues.Length; ++i) {
            curr = dialogues[i];
            if (curr == this) {
                continue;
            }

            if (curr.onDialogue) {
                return true;
            }
        }

        return false;
    }


    //public void Interact() {
    //    Collider2D hit = Physics2D.OverlapCircle(transform.position, radius, playerLayer);

    //    if (hit != null) {
    //        onRadius = true;
    //    } else {
    //        onRadius = false;
    //        if (onDialogue) {
    //            onDialogue = false;
    //            dc.Close();
    //        }
    //    }
    //}

    //private void OnDrawGizmosSelected() {
    //    Gizmos.DrawWireSphere(transform.position, radius);
    //}


}
