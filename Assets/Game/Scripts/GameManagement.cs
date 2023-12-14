using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;
using UnityEngine.Profiling;
using UnityEngine.Rendering.Universal;
using UnityEngine.UI;

public class GameManagement : MonoBehaviour{

    public Transform[] interactableObjects;

    public static GameManagement Instance;

    public Animation panelFadeImage;

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





    private void Awake() {
        DontDestroyOnLoad(this.gameObject);

        Instance = this;
        Application.targetFrameRate = 60; DontDestroyOnLoad(this.gameObject);

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

        playerController.transform.position = position == new Vector3(0, 0, 0) ? 
                                              playerInitialPosition : new Vector3(position.x, playerInitialPosition.y, position.z);

        panelFadeImage.enabled = false;


       
    }

    public void BlockAllInputs(bool block) {
        blockInputPanel.SetActive(block);
    }


    public void OnRightHandedToggle(bool value) {

        if (dialogueControl.dialogueObj.activeSelf || monologueController.monologueObj.activeSelf)
            return;

        SetDefaultLayout(!value);
        
        SetLeftHandedLayout(false);

        SetRightHandedLayout(value);

        

    }

    public void OnLeftHandedToggle(bool value) {

        if (dialogueControl.dialogueObj.activeSelf || monologueController.monologueObj.activeSelf)
            return;

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

    