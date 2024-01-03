using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class Quest : MonoBehaviour{
    public Sprite[] subIcons;
    public Sprite icon;
    public Indicator indicator;
    public GameObject mapIcon;
    public GameObject player;
    public Vector3 mainWagonPosition;
    public Animation fadePanel;
    public Animator animator;

    //------------------------------------------------------------------------------------
    public bool started = false, concluded = false, itemCaught = false;
    public QuestItem item;
    public Dialogue dialogue;
    public int[] dialogueIndexRangeStart = new int[2];
    public int[] dialogueIndexRangeMiddle = new int[2];
    public int[] dialogueIndexRangeEnd = new int[2];
    public int[] dialogueIndexRangePostEnd = new int[2];
    public GameObject questAlert;
    public float endQuestPositionX;
    public Action onStarted = () => { };
    public Action onItemCaught = ()=> { };
    public Action onConcluded = () => { };
    private bool isIluminated;
    private PlayerController playerController;

    // Start is called before the first frame update
    void Start() {
        playerController = FindFirstObjectByType<PlayerController>();
        fadePanel = GameManagement.Instance.panelFadeImage;
    }

    // Update is called once per frame
    void Update() {
        isIluminated = IsIluminated();
        questAlert.SetActive(isIluminated);

        bool isInMainRoom = player != null && player.GetComponent<PlayerController>().IsInMainRoom();
        if (!isIluminated && !isInMainRoom) {
            GameManagement.Instance.RemoveInteract(this);
            return;
        }

        GameManagement.Instance.AddInteract(this);
        if ((Input.GetMouseButtonDown(0) || Input.touchCount > 0)) {
            Vector3 clickPosition;

            clickPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            if (Input.touchCount > 0) {
                Touch touch = Input.GetTouch(Input.touchCount - 1);
                clickPosition = Camera.main.ScreenToWorldPoint(touch.position);
            }
            clickPosition.z = 0;

            Vector2 clickPosition2D = new Vector2(clickPosition.x, clickPosition.y);
            Collider2D hitCollider = Physics2D.OverlapPoint(clickPosition2D, dialogue.npcLayer);
            if (hitCollider != null) {
                print($"NPC {hitCollider.name}");

                if (hitCollider.gameObject == gameObject) {
                    Questing();
                }
            }
        }
    }

    public IEnumerator EndQuest() {
        concluded = true;
        animator.SetBool("questConcluded", concluded);
        GameManagement.Instance.BlockAllInputs(true);

        yield return GameManagement.Instance.CircularOut();

        this.setAtMainWagon();
        yield return new WaitForSeconds(2);

        yield return GameManagement.Instance.CircularIn();

        dialogue.dc.onDialogueClose -= EndThisQuest;
        dialogue.dc.onBrosConcluded -= EndThisQuest;

        GameManagement.Instance.BlockAllInputs(false);

        StopCoroutine(nameof(EndQuest));
    }

    public void EndThisQuest() {
        StartCoroutine(EndQuest());
    }

    private void ChangeIndicators(int index) {
        mapIcon.SetActive(index == 0);

        indicator.SetSpriteImage (icon);
        indicator.SetSpriteSubImage(subIcons[index]);
    }

    public bool IsIluminated() {
        if (concluded) {
            return MathF.Abs(playerController.transform.position.x - this.transform.position.x) < 2.5f;
        }

        List<Collider2D> col = new();
        Physics2D.OverlapCollider(this.GetComponent<Collider2D>(), new ContactFilter2D(), col);

        return col.Any<Collider2D>(itm => itm.gameObject.name == "Lantern"); 
    }

    public void Questing() {
        print($"Is Iluminated: {isIluminated}");
        print($"On Dialogue: {dialogue.onDialogue}");

        if (dialogue.onDialogue) {
            return;
        }

        print($"Started: {started}\nitemCaught: {itemCaught}\nConcluded: {concluded}");
        this.GetComponent<SpriteRenderer>().flipX = true;
        if (playerController.transform.position.x > this.transform.position.x) {
            this.GetComponent<SpriteRenderer>().flipX = false;
        }

        if (this.gameObject.name.Equals("Irmaos")) {
            if (concluded == false) {
                ChangeIndicators(0);
                //dialogue.dc.onRefuseBros = () => ChangeIndicators(0);
                dialogue.dc.onBrosConcluded = () => ChangeIndicators(1);
                dialogue.dc.onBrosConcluded += EndThisQuest;

                dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
                dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
                dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray());
            } else {
                dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangePostEnd[0], dialogueIndexRangePostEnd[1]).ToArray(),
                dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangePostEnd[0], dialogueIndexRangePostEnd[1]).ToArray(),
                dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangePostEnd[0], dialogueIndexRangePostEnd[1]).ToArray());
            }

            return;
        }

        if (!started && !itemCaught && !concluded) {//Quest não iniciada
            print("Quest não iniciada");

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeStart[0], dialogueIndexRangeStart[1]).ToArray());

            started = true;
            item.gameObject.SetActive(true);

            ChangeIndicators(0);

            onStarted();
        } else if (started && !itemCaught && !concluded) { //Quest iniciada, item não pego
            print("Quest iniciada, item não pego");

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeMiddle[0], dialogueIndexRangeMiddle[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeMiddle[0], dialogueIndexRangeMiddle[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeMiddle[0], dialogueIndexRangeMiddle[1]).ToArray());
        } else if (started && itemCaught && !concluded) { //Quest iniciada, item pego, não concluida
            print("Quest iniciada, item pego, não concluida");

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangeEnd[0], dialogueIndexRangeEnd[1]).ToArray());

            ChangeIndicators(1);

            dialogue.dc.onDialogueClose += EndThisQuest;
        } else if (started && itemCaught && concluded) { //Quest concluida
            print("Quest concluida");

            dialogue.StartSpeech(dialogue.profile.ToList<Sprite>().GetRange(dialogueIndexRangePostEnd[0], dialogueIndexRangePostEnd[1]).ToArray(),
            dialogue.speechTxt.ToList<string>().GetRange(dialogueIndexRangePostEnd[0], dialogueIndexRangePostEnd[1]).ToArray(),
            dialogue.actorName.ToList<string>().GetRange(dialogueIndexRangePostEnd[0], dialogueIndexRangePostEnd[1]).ToArray());
        }
    }

    public void setAtMainWagon() {
        this.transform.position = mainWagonPosition;
    }
}
