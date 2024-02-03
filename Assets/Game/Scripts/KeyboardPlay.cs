using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class KeyboardPlay : MonoBehaviour
{

    [SerializeField] GameObject[] blockInputPanels = new GameObject[3];
    [SerializeField] GameObject dialogueObject, monologueObject;

    enum InputUsing {
        keyboard,
        mouse,
        joystick
    }

    InputUsing inputUsing;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {

        if (Input.anyKey)
            if (Input.GetMouseButton(0) || Input.GetMouseButton(1) || Input.GetMouseButton(2)) 
                inputUsing = InputUsing.mouse;
            else
                inputUsing = InputUsing.keyboard;
        else
            inputUsing = InputUsing.joystick;


        if (inputUsing != InputUsing.mouse)
            GetMovementInputs();
        
        GetLanternInput();
        GetInteractInput();


    }

    void GetInteractInput() {
        if (Input.GetAxisRaw("Interact") > 0) {
            CancelInvoke(nameof(Interact));
            Invoke(nameof(Interact), 0.1f);
            
        }
    }

    void GetLanternInput() {

        foreach (GameObject panel in blockInputPanels)
            if (panel.activeSelf)
                return;

        if (Input.GetAxis("Lantern") > 0) {
            CancelInvoke(nameof(ToggleTheLight));
            Invoke(nameof(ToggleTheLight), 0.1f);
        }
    }

    void GetMovementInputs() {
        foreach (GameObject panel in blockInputPanels)
            if (panel.activeSelf)
                return;


        if (Input.GetAxisRaw("Horizontal") > 0)
            PlayerController.Instance.StartMovingRight();
        else if (Input.GetAxisRaw("Horizontal") < 0)
            PlayerController.Instance.StartMovingLeft();
        else
            PlayerController.Instance.StopMoving();

    
    }



    void Interact() {

        bool onDialogue = dialogueObject.activeSelf;
        bool onMonologue = monologueObject.activeSelf;

        if (onMonologue)
            MonologueController.Instance.NextSentence();
        else if (onDialogue)
            DialogueControl.Instance.NextSentence();
        else
            GameManagement.Instance.Interact();
    }

    void ToggleTheLight() {
        LightToggle.Instance.ToggleLight(!LightToggle.Instance.lightActive);
    }
}
