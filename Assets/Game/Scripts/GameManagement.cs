using System.Reflection;
using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using System.Collections;
using System;


public class GameManagement : MonoBehaviour{

    public Transform[] interactableObjects;

    public static GameManagement Instance;

    public Animation panelFadeImage;
    public Animator hands;

    public GameObject blockInputPanel;
    
    private PlayerController playerController;
    private Vector3 playerInitialPosition;


    [Header("Handed Controlled Objects")]

    public GameObject defaultControlLayout;
    public GameObject rightHandedControlLayout;
    public GameObject lefttHandedControlLayout;
    public GameObject dialogueDefaultLayout;
    public GameObject dialogueRightHandedLayout;
    public GameObject dialogueLeftHandedLayout;
    public GameObject monologueDefaultLayout;
    public GameObject monologueRightHandedLayout;
    public GameObject monologueLeftHandedLayout;
    public HorizontalLayoutGroup questIcons;
    public DialogueControl dialogueControl;
    public MonologueController monologueController;


    [Header("Dialogue Components")]
    public Image profileD;
    public Image profileR;
    public Image profileL;
    public Text speechTextD, speechTextR, speechTextL;
    public Text actorNameTextD, actorNameTextR, actorNameTextL;

    [Header("dialogue Buttons")]
    public GameObject nextButtonD;
    public GameObject nextButtonR;
    public GameObject nextButtonL;
    public GameObject continueGroupD, continueGroupR, continueGroupL;

    [Header("Monolgue Components")]
    public Image profileMonologueD;
    public Image profileMonolgueR;
    public Image profileMonolgueL;
    public Text speechTextMonolgueD, speechTextMonolgueR, speechTextMonolgueL;
    public Text actorNameTextMonolgueD, actorNameTextMonologueR, actorNameTextMonolgueL;
    public GameObject moveArrowLeftD, moveArrowLeftR, moveArrowLeftL;
    public GameObject moveArrowRightD, moveArrowRightR, moveArrowRightL;
    public GameObject tglLightD, tglLightR, tglLightL;

    [Header("monologue Buttons")]
    public GameObject nextButtonMonolgueD;
    public GameObject nextButtonMonolgueR;
    public GameObject nextButtonMonolgueL;


    public List<Quest> interactableNPCs = new();
    public List<QuestItem> interactableItems = new();
    public Door interactableDoor;

    public Material circularCutout;
    public Animation circularMask;

    public GameObject jumpScareImage;
    public GameObject jumpScareDialogue;

    private bool firstTimeCaught = true;

    



    //Renderer renderer = new(); renderer.material.SetFloat("_Cutoff", 0.5f) ;



    private void Awake() {
        //DontDestroyOnLoad(this.gameObject);

        Instance = this;
        Application.targetFrameRate = 60; 


    }


    // Start is called before the first frame update
    void Start(){

        playerController = PlayerController.Instance;
        playerInitialPosition = playerController.transform.position;
        
    }

    // Update is called once per frame
    void Update(){

        

        if (Input.GetKeyDown(KeyCode.I))
            circularMask.Play("circularIn");

        if (Input.GetKeyDown(KeyCode.O))
            circularMask.Play("circularOut");


    }
    public IEnumerator CircularIn() {

        if (!circularMask.isPlaying)
            circularMask.Play("circularIn");

        yield return new WaitUntil(()=>!circularMask.IsPlaying("circularIn"));
               
        StopCoroutine(nameof(CircularIn));

    }

    public IEnumerator CircularOut() {

        if (!circularMask.isPlaying)
            circularMask.Play("circularOut");

        yield return new WaitUntil(() => !circularMask.IsPlaying("circularOut"));

        StopCoroutine(nameof(CircularOut));
    }

    public IEnumerator CircularIn(float duration, float step = 0.02f) {

        if (step <= 0)
            step = 0.02f;

        float elapsedTime = 0;

        while (elapsedTime <= duration) {
            yield return new WaitForSeconds(elapsedTime/(duration/step)); //Sei l� porqu� assim funciona
            //yield return new WaitForSeconds(step); //E assim n�o (tempo quase dobrado)
            elapsedTime += step;
            print(elapsedTime);

            circularCutout.SetFloat("_Cutoff", elapsedTime  / MathF.Round(duration));
        }


        StopCoroutine(nameof(CircularIn));

    }

    public IEnumerator CircularOut(float duration, float step = 0.02f) {

        print("coroutine");

        if (step <= 0)
            step = 0.02f;

        float UnelapsedTime = duration;

        while (UnelapsedTime >= 0) {
            yield return new WaitForSeconds(UnelapsedTime / (duration / step)); //Sei l� porqu� assim funciona
            //yield return new WaitForSeconds(step); //E assim n�o (tempo quase dobrado)
            UnelapsedTime -= step;
            print(UnelapsedTime);

            circularCutout.SetFloat("_Cutoff", UnelapsedTime / MathF.Round(duration));
        }

        StopCoroutine(nameof(CircularOut));
    }

    public void Interact() {

        if (interactableDoor.isInteractable) {
            interactableDoor.Interact();
            return;
        }

        if (interactableNPCs.Count > 0) {
            interactableNPCs[0].Questing();
            RemoveInteract(interactableNPCs[0]);
            return;
        }

        if (interactableItems.Count > 0) {
            interactableItems[0].Caught();
            RemoveInteract(interactableItems[0]);

        }
    }

    public void AddInteract(Quest quest) {

        if (!interactableNPCs.Contains(quest))
            interactableNPCs.Add(quest);

    }

    public void RemoveInteract(Quest quest) {

        if (interactableNPCs.Contains(quest))
            interactableNPCs.Remove(quest);
    }

    public void AddInteract(QuestItem item) {

        if (!interactableItems.Contains(item))
            interactableItems.Add(item);

        print(interactableItems.Count);
        print(interactableItems[0]);


    }

    public void RemoveInteract(QuestItem item) {

        if (interactableItems.Contains(item))
            interactableItems.Remove(item);
    }

    /// <summary>
    /// Sets the player position in the wolrd scene
    /// </summary>
    /// <param name="position" >
    ///     <para>
    ///         The desired position. Initial position by default
    ///     </para>
    ///     <para>
    ///         The Y axis is always the same of initial position
    ///     </para>
    ///</param>
    public void SetPlayerPosition(Vector3 position = new Vector3()) {

        if (position == new Vector3(0, 0, 0)) {
            playerController.transform.position = playerInitialPosition;

            for (int index = 0; index < ParallaxController.Instance.planesPosition.Length; index++) {
                SetPosition(ParallaxController.Instance.planes[index], ParallaxController.Instance.planesPosition[index]);
            }

        } else {
            playerController.transform.position = new Vector3(position.x, playerInitialPosition.y, position.z);

            for (int index = 0; index < ParallaxController.Instance.planesPosition.Length; index++) {
                SetPosition(ParallaxController.Instance.planes[index], 
                    new Vector3(position.x + (ParallaxController.Instance.planesPosition[index].x -playerInitialPosition.x), 
                                ParallaxController.Instance.planesPosition[index].y,
                                ParallaxController.Instance.planesPosition[index].z));
            }
        }

        
        panelFadeImage.CrossFade("fadePanelIn", 0.01f);
        PlayHandsIn();

        
       
    }

    void PlayHandsIn() {

        hands.SetBool("handsIn", true);


    }

    void PlayHandsOut() {

        hands.SetBool("handsIn", false);
        //hands.SetBool("handsIn", false);
        hands.SetTrigger("handsOut");
    }

    /// <summary>
    /// Actives or inactives the panel that block the UI input elements
    /// </summary>
    /// <param name="block"></param>
    public void BlockAllInputs(bool block) {
        blockInputPanel.SetActive(block);
    }

    public void OnRightHandedToggle(bool value) {

        if (dialogueControl.dialogueObj.activeSelf || monologueController.monologueObj.activeSelf)
            return;

        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroClick);

        SetDefaultLayout(!value);
        
        SetLeftHandedLayout(false);

        SetRightHandedLayout(value);

        

    }

    public void OnLeftHandedToggle(bool value) {

        if (dialogueControl.dialogueObj.activeSelf || monologueController.monologueObj.activeSelf)
            return;

        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.sonoroClick);

        SetDefaultLayout(!value);
        
        SetRightHandedLayout(false);

        SetLeftHandedLayout(value);


    }

    void SetDefaultLayout(bool value) {


        defaultControlLayout.SetActive(value);
        dialogueDefaultLayout.SetActive(value);
        monologueDefaultLayout.SetActive(value);

        if (value) {
            questIcons.childAlignment = TextAnchor.MiddleLeft;

            dialogueControl.profile = profileD;
            dialogueControl.speechText = speechTextD;
            dialogueControl.actorNameText = actorNameTextD;
            dialogueControl.nextButton = nextButtonD;
            dialogueControl.continueGroup = continueGroupD;

            tglLightD.SetActive(monologueController.lightTgl.activeSelf);
            Toggle tgl = tglLightD.GetComponent<Toggle>();
            tgl.isOn = monologueController.lightTgl.GetComponent<Toggle>().isOn;



            monologueController.profile = profileMonologueD;
            monologueController.speechText = speechTextMonolgueD;
            monologueController.actorNameText = actorNameTextMonolgueD;
            monologueController.moveArrowLeft = moveArrowLeftD;
            monologueController.moveArrowRight = moveArrowRightD;
            monologueController.lightTgl = tglLightD;
            monologueController.nextButton = nextButtonMonolgueD;

        }

    }

    void SetRightHandedLayout(bool value) {

        monologueRightHandedLayout.SetActive(value);
        dialogueRightHandedLayout.SetActive(value);
        rightHandedControlLayout.SetActive(value);

        if (value) {
            questIcons.childAlignment = TextAnchor.MiddleLeft;

            dialogueControl.profile = profileR;
            dialogueControl.speechText = speechTextR;
            dialogueControl.actorNameText = actorNameTextR;
            dialogueControl.nextButton = nextButtonR;
            dialogueControl.continueGroup = continueGroupR;

            tglLightR.SetActive(monologueController.lightTgl.activeSelf);
            Toggle tgl = tglLightR.GetComponent<Toggle>();
            tgl.isOn = monologueController.lightTgl.GetComponent<Toggle>().isOn;

            monologueController.profile = profileMonolgueR;
            monologueController.speechText = speechTextMonolgueR;
            monologueController.actorNameText = actorNameTextMonologueR;
            monologueController.moveArrowLeft = moveArrowLeftR;
            monologueController.moveArrowRight = moveArrowRightR;
            monologueController.lightTgl = tglLightR;
            monologueController.nextButton = nextButtonMonolgueR;
        }

    }

    void SetLeftHandedLayout(bool value) {

        monologueLeftHandedLayout.SetActive(value);
        dialogueLeftHandedLayout.SetActive(value);
        lefttHandedControlLayout.SetActive(value);

        if (value) {
            questIcons.childAlignment = TextAnchor.MiddleRight;

            dialogueControl.profile = profileL;
            dialogueControl.speechText = speechTextL;
            dialogueControl.actorNameText = actorNameTextL;
            dialogueControl.nextButton = nextButtonL;
            dialogueControl.continueGroup = continueGroupL;

            tglLightL.SetActive(monologueController.lightTgl.activeSelf);
            Toggle tgl = tglLightL.GetComponent<Toggle>();
            tgl.isOn = monologueController.lightTgl.GetComponent<Toggle>().isOn;

            monologueController.profile = profileMonolgueL;
            monologueController.speechText = speechTextMonolgueL;
            monologueController.actorNameText = actorNameTextMonolgueL;
            monologueController.moveArrowLeft = moveArrowLeftL;
            monologueController.moveArrowRight = moveArrowRightL;
            monologueController.lightTgl = tglLightL;
            monologueController.nextButton = nextButtonMonolgueL;
        }
    }

    public GameObject JumpScareImage() {
        return jumpScareImage;
    }

    public GameObject GetJumpScareDialogue() {
        return jumpScareDialogue;
    }

    public void WasCaught() {
        firstTimeCaught = false;
    }

    public bool GetFirstTimeCaught() {
        return firstTimeCaught;
    }

    public void SetPosition(Transform transform, Vector3 position) {
        transform.position = position;
    }

    public static void DebugCleaningLog(object message = null, bool clearError = false) {

#if UNITY_EDITOR

        var assembly = Assembly.GetAssembly(typeof(UnityEditor.Editor));
        var type = assembly.GetType("UnityEditor.LogEntries");
        var method = type.GetMethod("Clear");
        method.Invoke(new object(), null);

        if (clearError)
            Debug.ClearDeveloperConsole();

        if (message != null)
            print(message);
#endif
    }

}

    